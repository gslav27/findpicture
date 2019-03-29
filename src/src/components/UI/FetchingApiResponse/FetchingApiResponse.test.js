import React from 'react';
import renderer from 'react-test-renderer';
import { NoImages, LoadingIcon } from './FetchingApiResponse';

describe('<NoImages />', () => {
  describe('when no children are passed ', () => {
    test('should render empty component', () => {
      const tree = renderer.create(<NoImages />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when children are passed ', () => {
    test('should render component with "some text" nested', () => {
      const tree = renderer.create(<NoImages>some text</NoImages>).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});


describe('<LodingIcon />', () => {
  test('should render component with svg element', () => {
    const tree = renderer.create(<LoadingIcon />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
