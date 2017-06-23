import React from 'react';
import { Button, Icon,Dropdown} from 'semantic-ui-react';

class DownloadButton extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        let downloadOptions =[    
          {value:'title' , text:'Title'},
          {value:'description' , text:'Description'},
          {value:'content' , text:'Content'},
          {value:'speakernotes' , text:'Speakernotes'}

        ];
        return(
          <Dropdown icon='download' button search>

          </Dropdown>
        );
    }
}
export default DownloadButton;
