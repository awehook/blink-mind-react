import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import DemoBlinkMindReact from './demo-blink-mind-react';
import DemoScrollApi1 from './demo-scroll-api/Demo1';
import DemoScrollApi2 from './demo-scroll-api/Demo2';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('blink-mind-react-demo', module)
  .add('demo1', () => <DemoBlinkMindReact/>)
  ;

storiesOf('drag-scroll-demo', module)
  .add('demo1', () => <DemoScrollApi1/>)
  .add('demo2', () => <DemoScrollApi2/>)
;
