import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import { ChangeEvent, ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ListChildComponentProps } from 'react-window'
import { settingsSchema } from '../common/validation-schemas'
import VirtualizedTable from '../components/virtualized-table'
import useUsers from '../hooks/use-users'

const supportedLocales = ['en', 'de', 'pl']

const defaultValues = {
  locale: supportedLocales[0],
  seed: 0,
  errorsCount: 0,
}

const Row: React.ComponentType<
  ListChildComponentProps & { render: (index: number) => ReactElement }
> = ({ index, style }) => {
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  )
}

const Home: NextPage = () => {
  const {
    handleSubmit,
    control,
    getValues,
    register,
    formState: { errors },
  } = useForm<{
    seed: number
    locale: string
    errorsCount: number
  }>({
    defaultValues,
    resolver: yupResolver(settingsSchema),
  })

  const { users, fetchUsers, downloadCsv } = useUsers(getValues())

  return (
    <>
      <Container sx={{ py: 2, display: 'grid', gap: 5 }}>
        <Grid
          container
          component="form"
          onSubmit={handleSubmit((data) => fetchUsers(data, true))}
          spacing={5}
          alignItems="center"
        >
          <Grid item>
            <Controller
              control={control}
              name="locale"
              defaultValue={defaultValues.locale}
              render={({ field }) => (
                <FormControl>
                  <InputLabel id="locale-select-label">Locale</InputLabel>

                  <Select
                    labelId="locale-select-label"
                    id="locale-select"
                    label="Age"
                    {...field}
                  >
                    {supportedLocales.map((locale) => (
                      <MenuItem key={locale} value={locale}>
                        {locale}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid container item alignItems="center" width="auto">
            <Box>
              <Typography gutterBottom>Errors</Typography>

              <Controller
                control={control}
                name="errorsCount"
                defaultValue={defaultValues.errorsCount}
                render={({ field }) => (
                  <Slider
                    sx={{ width: '200px', mr: 2 }}
                    step={0.25}
                    max={10}
                    valueLabelDisplay="auto"
                    {...field}
                  />
                )}
              />
            </Box>

            <Controller
              control={control}
              name="errorsCount"
              defaultValue={defaultValues.errorsCount}
              render={({ field: { onChange, ...field } }) => (
                <TextField
                  sx={{ width: '90px' }}
                  error={!!errors.errorsCount?.message}
                  helperText={errors.errorsCount?.message}
                  inputProps={{ min: 0, step: 0.25, max: 1000 }}
                  onChange={(event_: ChangeEvent<HTMLInputElement>) =>
                    onChange(event_.target.valueAsNumber)
                  }
                  type="number"
                  label="Errors"
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item>
            <TextField
              error={!!errors.seed?.message}
              helperText={errors.seed?.message}
              defaultValue={0}
              type="number"
              label="Seed"
              {...register('seed')}
            />
          </Grid>

          <Grid item>
            <Button type="submit" variant="contained" size="large">
              Random
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={async () => await downloadCsv(getValues())}
              variant="contained"
              size="large"
            >
              Export to CSV
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ bgcolor: '#bbb', height: '2px' }} />

      <Container sx={{ py: 2, display: 'grid', gap: 5 }}>
        <Paper style={{ height: 700, width: '100%' }}>
          <VirtualizedTable
            initialRowCount={20}
            loadData={() => fetchUsers(getValues())}
            rowCount={users.length}
            rowGetter={({ index }) => users[index]}
            columns={[
              {
                width: 50,
                label: 'Index',
                dataKey: 'index',
              },
              {
                width: 170,
                label: 'Random Identifier',
                dataKey: 'randomIdentifier',
              },
              {
                width: 120,
                label: 'Firstname',
                dataKey: 'firstName',
              },
              {
                width: 120,
                label: 'Middlename',
                dataKey: 'middleName',
              },
              {
                width: 120,
                label: 'Lastname',
                dataKey: 'lastName',
              },
              {
                width: 300,
                label: 'Address',
                dataKey: 'address',
              },
              {
                width: 240,
                label: 'Phone',
                dataKey: 'phone',
              },
            ]}
          />
        </Paper>
      </Container>
    </>
  )
}

export default Home
