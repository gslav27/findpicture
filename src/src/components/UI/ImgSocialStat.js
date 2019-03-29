import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';

import Chat from '@material-ui/icons/Chat';
import Pageview from '@material-ui/icons/Pageview';
import GetApp from '@material-ui/icons/GetApp';

import { formatData } from '../../operations/appAddsOperations';

import FavoritesButton from './FavoritesButton';



class ImgSocialStat extends Component {
  getActionsArray = (actionsDataObj) => {
    const _actionsDataKeys = Object.keys(actionsDataObj);
    if (this.props.componentType === 'imageviewer') {
      return _actionsDataKeys.slice(0, -1);
    }
    return _actionsDataKeys;
  };

  
  render() {
    const { img, imgIndex, componentType } = this.props;

    const _actionsData = {
      comments: {
        title: 'read at Pixabay',
        icon: <Chat />,
      },
      views: {
        title: 'see at Pixabay',
        icon: <Pageview />,
      },
      downloads: {
        title: 'download from Pixabay',
        icon: <GetApp />,
      },
    };

    const _favoritesAction = (
      <FavoritesButton
        img={img}
        imgIndex={imgIndex}
        componentType={componentType}
      />
    );

    const _actionsDataArray = this.getActionsArray(_actionsData);

    const _otherActions = _actionsDataArray.map(statType => (
      <React.Fragment key={statType}>
        <IconButton
          className='socialDataIconButton'
          title={_actionsData[statType].title}
          href={img.pageURL}
          target='_blank'
          children={_actionsData[statType].icon}
        />
        <div
          className='socialDataQty'
          children={formatData(img[statType])}
        />
      </React.Fragment>
    ));

    return (
      <React.Fragment>
        {_favoritesAction}
        {_otherActions}
      </React.Fragment>
    );
  }
}


export default ImgSocialStat;
