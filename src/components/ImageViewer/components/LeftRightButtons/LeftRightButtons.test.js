import React from 'react';
import renderer from 'react-test-renderer';
import LeftRightButtons from './LeftRightButtons';

describe('<LeftRightButtons />', () => {
  describe('when "mobileWithTouch" props is true', () => {
    test('should render component without "buttonsHover" class for all buttons', () => {
      const tree = renderer.create(<LeftRightButtons mobileWithTouch />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when "mobileWithTouch" props is false', () => {
    test('should render component with "buttonsHover" class for all buttons', () => {
      const tree = renderer.create(<LeftRightButtons mobileWithTouch={false} />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
