import {
  Box, Typography, Paper, Divider, Chip, Stack, useMediaQuery,
  useTheme, Table, TableHead, TableBody, TableCell, TableRow
} from '@mui/material';
import { formatDDMMYYYY, formatMonthYear, formatTimeTo12Hour, formatDateToReadable  } from "./dateUtils";
import CustomInstructionComponent from '../components/Inputs/CustomInstructionComponent';
import PastAuditFindingCustomQuestion from '../features/opening-meeting/PastAuditFindingCustomQuestion';


export const getAnswerText = (question, answer, isPreviewMode) => {
  //const answer = answersMap?.[question.questionnaireId];
  //const answer = answersMap?.[question.questionnaireId];

  if (question.answerType !== 'INSTRUCTION' && (!answer || answer.length === 0)) return '—';
 
  switch (question.answerType) {
    case 'SINGLELINE':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Ans:</Typography>
        <Typography variant='body2' > {answer} </Typography>
      </Box>)
    case 'AMOUNT':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Amount:</Typography>
        <Typography variant='body2' > {"₹ "}{answer} </Typography>
      </Box>)

   case 'DENOMINATION': {
  const noteValueMap = {
    note_10: 10,
    note_20: 20,
    note_50: 50,
    note_100: 100,
    note_200: 200,
    note_500: 500,
    note_2000: 2000,
  };

  const rows = Object.entries(answer || {})
    .filter(([_, count]) => count > 0)
    .map(([key, count]) => {
      const note = noteValueMap[key] || parseInt(key.replace('note_', ''), 10);
      return {
        note,
        count,
        amount: note * count,
      };
    });

  const total = rows.reduce((sum, r) => sum + r.amount, 0);

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" mt={1}>
        No denomination filled.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem', mb: 1, display: 'inline-block' }}>
        Denomination Breakdown:
      </Typography>
      <Paper elevation={1} sx={{ borderRadius: 2, width: 'fit-content' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Denomination</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Count</TableCell>
              <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontSize: '0.75rem' }}>{"₹"}{row.note}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.count}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.amount.toLocaleString('en-IN')}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                ₹{total.toLocaleString('en-IN')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}


    case 'TIME':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Time:</Typography>
        <Typography variant='body2'> {formatTimeTo12Hour(answer)} </Typography>
      </Box>)

    case 'MONTHYEAR':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Month and Year:</Typography>
        <Typography variant='body2'> {formatMonthYear(answer)} </Typography>
      </Box>)


    case 'MULTILINE':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Ans:</Typography>
        <Typography variant='body2'> {answer} </Typography>
      </Box>)


    case 'DATE':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Date:</Typography>
        <Typography variant='body2'> {formatDateToReadable(answer)} </Typography>
      </Box>)


    case 'BOOLEAN':
    case 'OPTION':
      let ans = ''
      if(isPreviewMode){
        let findOptionText = question?.options?.find(x => x.optionId == answer[0])
        ans = findOptionText?.optionText || '-'

      }
      else{
        ans = answer[0]?.option_text 
      }
      return (<Box display={'flex'} gap={2} alignItems={'center'} mt={1}>
        <Box>
          <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Option:</Typography>
        </Box>
        <Chip label={ ans || '-'} sx={{ m: 1 }}></Chip>

      </Box>)
    case 'DYNAMIC-OPTION':
      let getAns = ''
      
      if(isPreviewMode){
        let findOptionText = question?.options?.find(x => x.optionId == answer[0])
        getAns = findOptionText?.optionText || '-'

      }
      else{
        let findOptionText = question?.allOptions?.find(x => x.option_id == answer[0])
        console.log('DYNAMIC-OPTION', question?.allOptions, isPreviewMode, answer, findOptionText)
        getAns = findOptionText?.option_text || '-'
      }
      return (<Box display={'flex'} gap={2} alignItems={'center'} mt={1}>
        <Box>
          <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Option:</Typography>
        </Box>
        <Chip label={ getAns || '-'} sx={{ m: 1 }}></Chip>

      </Box>)


    case 'MULTI OPTION':
          
      let ansList = []
      if(isPreviewMode){
        answer?.forEach(oId => {
          let findOptionsSelected= question?.options?.find(x => x.optionId == oId)
          if(findOptionsSelected){
            ansList.push({'option_text': findOptionsSelected?.optionText || '-' })
          }
        })
      

      }
      else{
        ansList = answer
      }
        
     
      return (<Box display={'flex'} gap={2} alignItems={'center'} mt={1}>
        <Box>
          <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Options:</Typography>
        </Box>
        <Box>
          {ansList
            .map(a => <Chip label={a.option_text || '-'} sx={{ m: 1 }}></Chip>)
          }
        </Box>
      </Box>)

      case 'CUSTOM_OPTION_BASED_ON_USER_INPUT_MULTI_SELECT':
          
      let ansListMulti = answer || []
    //   if(isPreviewMode){
    //     answer?.forEach(oId => {
    //       let findOptionsSelected= question?.options?.find(x => x.optionId == oId)
    //       if(findOptionsSelected){
    //         ansList.push({'option_text': findOptionsSelected?.optionText || '-' })
    //       }
    //     })
      

    //   }
    //   else{
    //     ansList = answer
    //   }

    console.log("MULTI CUSTOM_OPTION_MULTI_SELECT_VIEW", ansListMulti)
        
     
      return (<Box display={'flex'} gap={2} alignItems={'center'} mt={1}>
        <Box>
          <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Selected Options:</Typography>
        </Box>
        <Box>
          {ansListMulti?.map(a => <Chip label={a || '-'} sx={{ m: 1 }}></Chip>)
          }
        </Box>
      </Box>)

    case 'INSTRUCTION':
            console.log('INSTRUCTION', question, answer, isPreviewMode)
            return (<CustomInstructionComponent 
                label={''}
                
                options={question?.options || []}
                questionId={question?.questionId || 0} />);

    case 'DYNAMIC-MULTILINE':
      return (
        <PastAuditFindingCustomQuestion
          type="multi"
          label={""}
          isDisabled={true}
          initialValue={answer || []}
          questionId={0}
        />
      );
    case 'CUSTOM_OPTION_BASED_ON_USER_INPUT_SINGLE_SELECT':
      return (<Box display={'flex'} gap={2} mt={1}>
        <Typography sx={{ borderBottom: '2px solid green', fontSize: '0.8rem' }}>Ans:</Typography>
        <Typography variant='body2' > {answer} </Typography>
      </Box>)

    case 'YES_NO':
      return answer[0] === 'YES' ? 'Yes' : 'No';

    case 'DYNAMIC_ANSWER_ARRAY':
      return answer.map((a, i) => `• ${a}`).join('\n');

    default:
     
      return JSON.stringify(answer);
  }
};