export interface ThemeColor {
  primary: string;
  fontColor: string;
}
export interface ThemeConfig {
  name: string;
  color: ThemeColor;
}

const theme1: ThemeConfig = {
  name: 'orange',
  color: {
    primary: 'orange',
    fontColor: 'black'
  }
};

const theme2: ThemeConfig = {
  name: 'pink',
  color: {
    primary: 'pink',
    fontColor: 'black'
  }
};

export default {
  theme1,
  theme2
};
