import { Fields, MatchData, MatchedItem } from "../ContentScripts/input";
import { LabelInputMessage } from "../ContentScripts/listener";
import { PrefillData } from "../Lib/StorageType";
import { Column, Row, Item } from '@mui-treasury/components/flex';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Chip } from '@material-ui/core';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles(() => ({
  card: {
    width: '100%',
    borderRadius: 16,
    boxShadow: '0 8px 16px 0 #BDC9D7',
    overflow: 'hidden',
  },
  header: {
    fontFamily: 'Barlow, san-serif',
    backgroundColor: '#fff',
  },
  headline: {
    color: '#122740',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  link: {
    color: '#2281bb',
    padding: '0 0.25rem',
    fontSize: '0.875rem',
  },
  actions: {
    color: '#BDC9D7'
  },
  divider: {
    backgroundColor: '#d9e2ee',
    margin: '0 20px',
  },
  labelText: {
    margin: '0 20px',
  }
}));

function FieldsDisplay({ fields, data,matched, notMatched }:{
    fields: Fields,
    data: (PrefillData|null)
    matched: MatchData,
    notMatched: Map<string, string>
}) {
    const labelsArrs = Array.from(fields.values()).map(val=>val[1]);
    const labels: LabelInputMessage[] = ([] as LabelInputMessage[]).concat(...labelsArrs);
    const labelDisplays = labels.map((val, index)=><LabelDisplay key={index} text={val.labelText.trim().slice(0, 15)}/>);
    console.log("humbug: ", matched);
    const styles = useStyles();
    if (data === null) {
        return <div>
            {labelDisplays}
        </div>
    } else {
        return (
          <Column p={0} gap={0} className={styles.card}>
            <Row wrap p={2} alignItems={'baseline'} className={styles.header}>
              <Item stretched className={styles.headline}>Matched</Item>
              <Item className={styles.actions}>
                <Link className={styles.link}>Edit section</Link>
              </Item>
            </Row>
            <MatchedFields matched={matched} />
            {/* {labelDisplays} */}
            {/* <NotMatchedFields notMatched={notMatched}/> */}
          </Column>
        );
    }
}

function LabelDisplay({text}:{text:string}) {
    return <div>{text}</div>;
}

function MatchedFields({matched}:{matched: MatchData}) {
    const styles = useStyles();
    return (
    <>
    {([] as MatchedItem[]).concat(...Array.from(matched.values()).map(val=>val[1]))
    .map(({labelText, data}, index) => (
        <div key={index}>
          {/* {`${labelText}: ${data}`} */}
          <Grid
            item
            direction="row"
            spacing={4}
          >
            <Item className={styles.labelText}>
              {`${labelText}: `}
            </Item>
            <Chip
              label={data}
              clickable
              color="primary"
            />
          </Grid>
        </div>
      )
    )}
    </>);
}

function NotMatchedFields({notMatched}:{notMatched: Map<string, string>}) {
    return (
        <>
        <div>Not Matched: </div>
        {Array.from(notMatched.entries()).map(([k, v], index)=><div key={index}>{`${k}: ${v}`}</div>)}
    </>);
}

export default FieldsDisplay;