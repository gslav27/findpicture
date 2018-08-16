import userOptionTemplateStyle from '../../UserOptionTemplate.style';

const style = (theme) => {
  return {
    cardContent: {
      padding: '0.8em 16px 0 16px',
    },
    ...userOptionTemplateStyle(theme)
  }
}

export default style;