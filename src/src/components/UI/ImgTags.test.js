import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { ImgTags } from './ImgTags';


describe('<ImgTags />', () => {
  const getImgTagsComponent = tagsData => (
    <ImgTags
      tagsData={tagsData}
      fetchImages={jest.fn()}
      fetchPage={jest.fn()}
      fetchSearchText={jest.fn()}
    />
  );


  describe('when props.tagsData = "foo"', () => {
    const propsTagsData = 'foo';

    test('should render one Link component', () => {
      const tree = shallow(getImgTagsComponent(propsTagsData));
      expect(tree.find('Link')).toHaveLength(1);
    });

    test('should render one link with nested text "#foo"', () => {
      const tree = mount(<MemoryRouter>{getImgTagsComponent(propsTagsData)}</MemoryRouter>);
      expect(tree.find('a').text()).toEqual('#foo');
    });
  });


  describe('when props.tagsData = "42 foo baz"', () => {
    const propsTagsData = '42 foo baz';

    test('should render three Link components', () => {
      const tree = shallow(getImgTagsComponent(propsTagsData));
      expect(tree.find('Link')).toHaveLength(3);
    });

    test('should render three links with nested text "#42", "#foo" and "#baz"', () => {
      const tree = mount(<MemoryRouter>{getImgTagsComponent(propsTagsData)}</MemoryRouter>);
      expect(tree.find('a').at(0).text()).toEqual('#42');
      expect(tree.find('a').at(1).text()).toEqual('#foo');
      expect(tree.find('a').at(2).text()).toEqual('#baz');
    });
  });


  describe('when props.tagsData = "42, foo, baz"', () => {
    const propsTagsData = '42, foo, baz';

    test('should render three Link components', () => {
      const tree = shallow(getImgTagsComponent(propsTagsData));
      expect(tree.find('Link')).toHaveLength(3);
    });

    test('should render three links with nested text "#42", "#foo" and "#baz"', () => {
      const tree = mount(<MemoryRouter>{getImgTagsComponent(propsTagsData)}</MemoryRouter>);
      expect(tree.find('a').at(0).text()).toEqual('#42');
      expect(tree.find('a').at(1).text()).toEqual('#foo');
      expect(tree.find('a').at(2).text()).toEqual('#baz');
    });
  });


  describe('when props.tagsData = "42 foo, baz"', () => {
    const propsTagsData = '42 foo, baz';

    test('should render two links', () => {
      const tree = shallow(getImgTagsComponent(propsTagsData));
      expect(tree.find('Link')).toHaveLength(2);
    });

    test('should render two links with nested text "#42 foo" and "#baz"', () => {
      const tree = mount(<MemoryRouter>{getImgTagsComponent(propsTagsData)}</MemoryRouter>);
      expect(tree.find('a').first().text()).toEqual('#42 foo');
      expect(tree.find('a').last().text()).toEqual('#baz');
    });
  });
});
