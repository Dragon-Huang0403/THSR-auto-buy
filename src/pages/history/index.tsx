import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  styled,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { HISTORY_SEARCH_METHODS } from '~/src/utils/constants';
import type { RouterInputs } from '~/src/utils/trpc';

type HistoryInfo = RouterInputs['ticket']['history'];
type SearchMethod = HistoryInfo['searchMethod'];

const initialHistoryInfo = {
  searchMethod: 'purchased',
  taiwanId: '',
  orderId: '',
} as const;

const Form = styled('form')({});

const HistoryPage = () => {
  const [historyInfo, setHistoryInfo] =
    useState<HistoryInfo>(initialHistoryInfo);

  const router = useRouter();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/history/search?${new URLSearchParams(historyInfo)}`);
      }}
      sx={{ display: 'grid', gap: 2, py: 4, px: 2 }}
    >
      <FormControl>
        <FormLabel>查詢種類</FormLabel>
        <RadioGroup
          row
          value={historyInfo.searchMethod}
          onChange={(e, newMethod) => {
            setHistoryInfo((prev) => ({
              ...prev,
              searchMethod: newMethod as SearchMethod,
            }));
          }}
        >
          {HISTORY_SEARCH_METHODS.map((method) => (
            <FormControlLabel
              key={method.value}
              value={method.value}
              label={method.label}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <TextField
        id="input-taiwanId"
        required
        label="輸入身分證字號"
        value={historyInfo.taiwanId}
        onChange={(e) => {
          setHistoryInfo((prev) => ({
            ...prev,
            taiwanId: e.target.value,
          }));
        }}
      />
      {historyInfo.searchMethod === 'purchased' && (
        <TextField
          id="input-orderId"
          required
          label="輸入訂票號碼"
          value={historyInfo.orderId}
          onChange={(e) => {
            setHistoryInfo((prev) => ({
              ...prev,
              orderId: e.target.value,
            }));
          }}
        />
      )}
      <Button type="submit">查詢</Button>
    </Form>
  );
};

export default HistoryPage;
