

import { HelloWorld } from '../src/index'
import { expect } from 'chai';

describe('Hello function', () => {
  it('should return hello world', () => {
    expect(HelloWorld()).to.equal('Hello World!');
  });
});

