import React from "react";
import styles from "./PrefillSection.module.css";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SocialCardDemo }  from '../TestComponent/TestComponent';
import Box from '@mui/material/Box';
import { withStyles } from "@material-ui/core/styles"

// section_fields: {
//   title: 'Mr',
//   firstName: 'John',
//   lastName: 'Doe',
//   country: 'Australia',
//   mobile: '0404040404',
//   emailAddress: 'john.doe@testemail.com'
// }


interface Props {
  section_title: string;
  section_fields?: any;
}

const PrefillSection: React.FC<Props> = ({
  section_title, 
  section_fields,
}) => {

  return (
    // <div className={`${styles._section_body} ${styles.bottom_margin}`} >
    // <Card sx={{ minWidth: 275 }} variant="outlined">
    //   <CardContent>
    //     <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
    //       {section_title}
    //     </Typography>
    //     <Typography variant="h5" component="div">
    //       {section_fields.title}
    //     </Typography>
    //     <Typography sx={{ mb: 1.5 }} color="text.secondary">
    //       adjective
    //     </Typography>
    //     <Typography variant="body2">
    //       well meaning and kindly.
    //       <br />
    //       {'"a benevolent smile"'}
    //     </Typography>
    //   </CardContent>
    //   <CardActions>
    //     <Button size="small">Learn More</Button>
    //   </CardActions>
    // </Card>
    <SocialCardDemo />
  );
}

export default PrefillSection;


{/* <div className={`${styles._section_body} _section_body`} >
  <h1 className={`${styles._section_title} _section_title`}>{section_title}</h1>
  <h2 className={`${styles._section_field} _section_field`}>{section_fields.title}</h2>
  <h2 className={`${styles._section_field} _section_field`}>{section_fields.firstName}</h2>
  <h2 className={`${styles._section_field} _section_field`}>{section_fields.lastName}</h2>
</div> */}