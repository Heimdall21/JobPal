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