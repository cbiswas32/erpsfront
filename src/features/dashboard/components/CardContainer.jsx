import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function CardContainer(props) {
    const showbutton = props.showbutton;
    const buttonicon = props.buttonicon;
    const buttonOnClick = props.buttonclick;
    const buttontitle = props.buttontitle;
    return (
    <Card sx={{height: props.height || "auto"}} {...props}>
      {props.title && <Box sx={
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.2,
          px: 2
        }
      }>
      <Typography  variant='body2' fontWeight={500} color='secondary.main'>
          {props.title ? props.title :  ""}
      </Typography>
      {showbutton && showbutton === true && <Button sx={{
        padding: 0, // Remove internal padding
        margin: 0,  // Remove external margin
        minWidth: 'auto', // Optional: Remove minimum width
      }}  startIcon = {buttonicon} onClick={buttonOnClick}>
        <Typography variant='body2' >{buttontitle ||  "View All"}</Typography>
      </Button>}  
      </Box> } 
      {props.title && <Divider></Divider>}
      <CardContent sx={{
            height: "100%",
            background: (theme) => theme.palette.secondary.background,
          }} >
       {props.children}
      </CardContent>
      
    </Card>
    );
}

export default CardContainer;