import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import DemoBlinkMindReact from './demo-blink-mind-react';
import DemoScrollApi from './demo-scroll-api';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('blink-mind-react-demo', module)
  .add('demo', () => <DemoBlinkMindReact/>)
  ;

storiesOf('scroll-api-demo', module)
  .add('demo', () => <DemoScrollApi/>)
;
