import * as React from 'react';
import { ThemeProvider} from "styled-components";

export default function Theme({children}) {

  return (
    //@ts-ignore
    <ThemeProvider theme={{}}>
      <React.Fragment>
        {children}
      </React.Fragment>
    </ThemeProvider>
  )
}
