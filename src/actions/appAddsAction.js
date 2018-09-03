import * as types from './types';


const waitApiResponse = (loading = true) => ({
  type: types.WAIT_API_RESPONSE_TYPE_3,
  payload: loading,
});


export const authDialogOpen = (open = true) => ({
  type: types.SET_AUTH_DIALOG_STATUS,
  payload: open,
});


export const fetchUserHistory = () => (dispatch) => {
  dispatch(waitApiResponse());
  const userEmail = localStorage.getItem('findpicture_user');
  const fetchObj = {
    method: ('GET'),
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('findpicture_id_token')}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  fetch(`https://findpicture-6dee.restdb.io/rest/usershistory?q={"user.email":"${userEmail}"}`, fetchObj)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((response) => {
      const userHistory = response;

      // if user is new, create record in usersHistory collection (in database)
      if (userHistory.length === 0) {
        dispatch(waitApiResponse(false));
        const fetchObj = {
          method: ('POST'),
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('findpicture_id_token')}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ user: userEmail }),
        };
        fetch(`https://findpicture-6dee.restdb.io/rest/usershistory`, fetchObj)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((response) => {
            localStorage.setItem('findpicture_userID', response._id);
          });
      } else {
        localStorage.setItem('findpicture_userID', response[0]._id);
        if (userHistory[0].favorites == undefined) { userHistory[0].favorites = []; }
        if (userHistory[0].recentlywatched == undefined) { userHistory[0].recentlywatched = []; }
        dispatch(waitApiResponse(false));
        dispatch({
          type: types.UPDATE_USER_HISTORY,
          payload: userHistory[0],
        });
      }
    })
    .catch((error) => {
      console.log('fetchUserHistory There has been a problem with connect_to_restdb: ', error.message);
    });
};


export const clearUserHistory = () => {
  const userHistory = {
    favorites: [],
    recentlywatched: [],
  };
  return {
    type: types.UPDATE_USER_HISTORY,
    payload: userHistory,
  };
};


const updateUsersHistory = (method, dataType, data) => {
  const userID = localStorage.getItem('findpicture_userID');
  let body;
  switch (dataType) {
    case 'favorites':
      body = { favorites: data };
      break;
    case 'recentlywatched':
      body = { recentlywatched: data };
      break;
    default:
      break;
  }
  
  const fetchObj = {
    method,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('findpicture_id_token')}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  };
  fetch(`https://findpicture-6dee.restdb.io/rest/usershistory/${userID}`, fetchObj)
    .then((response) => {
      if (response.ok) {
        console.log('usersHistory update, status: done ');
      }
    })
    .catch((error) => {
      console.log('There has been a problem with connect_to_restdb: ', error.message);
    });
};


const checkImgInDatabase = (currentImg) => {
  // 1. check if current img is presented in the RestdbMediaArchive
  const fetchObj = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('findpicture_id_token')}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  fetch(`https://findpicture-6dee.restdb.io/media/*/meta`, fetchObj)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(response => response.findIndex(img => img.origname == currentImg.id))
    .then((imgIsInRestdb) => {
      if (imgIsInRestdb == -1) {
        // 2. if current img isn't in the RestdbMediaArchive, fetch it from Pixabay API & upload it to RestdbMediaArchive
        fetch(`${currentImg.largeImageURL}`)
          .then((response) => {
            if (response.ok) {
              return response.blob();
            }
          })
          .then((newBlob) => {
            const formData = new FormData();
            formData.append('bloba', newBlob, currentImg.id);
            const fetchObj = {
              method: 'POST',
              headers: { Authorization: `Bearer ${localStorage.getItem('findpicture_id_token')}` },
              body: formData,
            };
            fetch(`https://findpicture-6dee.restdb.io/media`, fetchObj)
              .catch((error) => {
                console.log('There has been a problem with img uploading: ', error.message);
              });
          });
      } else {
        console.log('current img is presented in the RestdbMediaArchive');
      }
    });
};


// type='0' is 'search results'; type='1' is 'recently watched'; type='2' is 'favorites'
export const addToFavorites = (ImgInd, type = 0) => (dispatch, getState) => {
  let currentImg;
  const favoritesImgs = [...getState().appAdds.favorites];
  let checkImgInFavorites;

  switch (type) {
    case 0:
      currentImg = getState().search.images[ImgInd];
      checkImgInFavorites = favoritesImgs.findIndex(img => img.id === currentImg.id);
      break;
    case 1:
      currentImg = getState().appAdds.recentlyWatchedImgs[ImgInd];
      checkImgInFavorites = favoritesImgs.findIndex(img => img.id === currentImg.id);
      break;
    default:
      checkImgInFavorites = ImgInd;
      break;
  }
  if (checkImgInFavorites === -1) {
    const newFavImg = Object.assign({}, currentImg);
    const currentTime = new Date();
    newFavImg.addDate = currentTime.getTime();
    favoritesImgs.unshift(newFavImg);
  } else {
    favoritesImgs.splice(checkImgInFavorites, 1);
  }
  dispatch({
    type: types.UPDATE_FAVORITES,
    payload: favoritesImgs,
  });

  // update favoritesImgs in restdb userHistory (database)
  const databaseFavoritesImgs = [...favoritesImgs];
  databaseFavoritesImgs.sort((a, b) => (
    (b.addDate - a.addDate)
  ));
  updateUsersHistory('PATCH', 'favorites', databaseFavoritesImgs);
  // upload added to favorites img to the RestdbMediaArchive (database)
  if (checkImgInFavorites === -1) {
    checkImgInDatabase(currentImg);
  }
};


export const updateRecentlyWatched = ImgInd => (dispatch, getState) => {
  const currentImg = getState().search.images[ImgInd];
  const { recentlyWatchedImgs } = getState().appAdds;
  const filteredRecentlyWatchedImgs = recentlyWatchedImgs.filter(img => (img.id !== currentImg.id));
  dispatch({
    type: types.UPDATE_RECENTLY_WATCHED,
    payload: [currentImg, ...filteredRecentlyWatchedImgs],
  });
  
  updateUsersHistory('PATCH', 'recentlywatched', [currentImg, ...filteredRecentlyWatchedImgs]);
  checkImgInDatabase(currentImg);
};


export const setWindowTop = (current = true) => ({
  type: types.WINDOW_TOP,
  payload: current,
});


export const favoritesOrder = (orderType, higherFirst) => (dispatch, getState) => {
  const favoritesImgs = [...getState().appAdds.favorites];
  favoritesImgs.sort((a, b) => (
    higherFirst ? (b[orderType] - a[orderType]) : (a[orderType] - b[orderType])
  ));

  const currentFavoritesOrderType = getState().appAdds.favoritesOrderType;
  // create new copy of getState().appAdds.favoritesOrderType with all data set to 'false'
  const newFavoritesOrderType = {};
  for (const key in currentFavoritesOrderType) {
    newFavoritesOrderType[key] = [false, false];
  }
  // set new order type
  newFavoritesOrderType[orderType] = higherFirst ? [true, false] : [false, true];

  dispatch({
    type: types.UPDATE_FAVORITES_ORDER,
    payload: [favoritesImgs, newFavoritesOrderType],
  });
};


export const formatData = (data) => {
  let formattedData;
  switch (true) {
    case (data < 1000):
      formattedData = data;
      break;
    case (data < 1000000):
      formattedData = `${(data / 1000).toFixed(0)}K`;
      break;
    default:
      formattedData = `${(data / 1000000).toFixed(0)}M`;
      break;
  }
  return formattedData;
};


export const findInFavorites = (index, favorites, isAuthenticated) => {
  // Array.findIndex() return -1 if there are no matches, then tilda ('~') operator converts -1 to 0,
  // so img isn't favorite if _isFavorite = 0, while any logical operator implicitly coerce 0 to 'false'),
  const imgIsFavorite = ~(
    isAuthenticated
      ? favorites.findIndex(favImg => favImg.id === index)
      : -1
  );
  return imgIsFavorite;
};
