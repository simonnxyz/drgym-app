import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  FormControlLabel,
  Select,
  Radio,
  RadioGroup,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkoutFormTitle from './WorkoutFormTitle';
import { schema, strengthExerciseSchema, cardioExerciseSchema } from './schema';

const cardioExercises = ['Running', 'Cycling', 'Swimming'];
const strengthExercises = ['Weightlifting', 'Push-ups', 'Squats'];

export default function WorkoutForm({
  dialogTitle,
  popupType,
  popupStatus,
  togglePopup,
  workout = {},
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [exerciseList, setExerciseList] = useState([]);

  const handleClose = () => {
    togglePopup(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      open={popupStatus}
      aria-labelledby="new-workout-dialog"
    >
      <WorkoutFormTitle id="new-workout-dialog" onClose={handleClose}>
        {dialogTitle}
      </WorkoutFormTitle>
      <Formik
        initialValues={
          popupType === 'new'
            ? {
                startDate: null,
                endDate: null,
                description: '',
                exerciseType: '',
                exercise: '',
                sets: '',
                weight: '',
                duration: null,
              }
            : {
                startDate: new Date(workout.startDate),
                endDate: new Date(workout.endDate),
                description: workout.description,
                exerciseType: workout.exerciseType || '',
                exercise: workout.exercise || '',
                sets: '',
                weight: '',
                duration: null,
              }
        }
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          setTimeout(() => {
            alert(
              JSON.stringify({ ...values, exercises: exerciseList }, null, 2)
            );
            actions.setSubmitting(false);
            handleClose();
          }, 1000);
        }}
        validationSchema={schema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          isSubmitting,
          setErrors,
        }) => (
          <Form>
            <DialogContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    name="startDate"
                    value={values.startDate}
                    onChange={(newValue) => {
                      setFieldValue('startDate', newValue);
                    }}
                    onBlur={handleBlur}
                    label={
                      !!errors.startDate ? `${errors.startDate}` : 'Start Date'
                    }
                    slotProps={{
                      textField: {
                        error: !!errors.startDate,
                      },
                    }}
                  />
                  <DateTimePicker
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    value={values.endDate}
                    onChange={(newValue) => {
                      setFieldValue('endDate', newValue);
                    }}
                    onBlur={handleBlur}
                    label={!!errors.endDate ? `${errors.endDate}` : 'End Date'}
                    slotProps={{
                      textField: {
                        error: !!errors.endDate,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <TextField
                id="description"
                label={
                  !!errors.description ? `${errors.description}` : 'Description'
                }
                name="description"
                error={!!errors.description}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                fullWidth
                multiline
                maxRows={4}
                sx={{ mt: 2 }}
              />

              <FormControl sx={{ mt: 2 }} fullWidth>
                <FormLabel error={!!errors.exerciseType}>
                  {errors.exerciseType || 'Exercise Type'}
                </FormLabel>
                <RadioGroup
                  row
                  name="exerciseType"
                  value={values.exerciseType}
                  onChange={(e) => {
                    setFieldValue('exerciseType', e.target.value);
                    setFieldValue('exercise', '');
                    setFieldValue('sets', '');
                    setFieldValue('weight', '');
                    setFieldValue('duration', null);
                  }}
                >
                  <FormControlLabel
                    value="strength"
                    control={<Radio />}
                    label="Strength"
                  />
                  <FormControlLabel
                    value="cardio"
                    control={<Radio />}
                    label="Cardio"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel error={!!errors.exercise}>
                  {errors.exercise || 'Exercise'}
                </FormLabel>
                <Select
                  name="exercise"
                  value={values.exercise}
                  onChange={handleChange}
                  disabled={!values.exerciseType}
                  onBlur={handleBlur}
                >
                  {(values.exerciseType === 'cardio'
                    ? cardioExercises
                    : strengthExercises
                  ).map((exercise) => (
                    <MenuItem key={exercise} value={exercise}>
                      {exercise}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {values.exerciseType === 'strength' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <TextField
                    label="Sets"
                    name="sets"
                    type="number"
                    value={values.sets}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.sets && touched.sets}
                    helperText={touched.sets && errors.sets}
                  />
                  <TextField
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    value={values.weight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.weight && touched.weight}
                    helperText={touched.weight && errors.weight}
                  />
                </Box>
              )}

              {values.exerciseType === 'cardio' && (
                <Box sx={{ mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Duration"
                      value={values.duration}
                      onChange={(newValue) =>
                        setFieldValue('duration', newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.duration && touched.duration}
                          helperText={touched.duration && errors.duration}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              )}

              <Button
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={() => {
                  const newExercise = {
                    exerciseType: values.exerciseType,
                    exercise: values.exercise,
                    sets: values.sets || null,
                    weight: values.weight || null,
                    duration: values.duration || null,
                  };

                  const exerciseSchema =
                    values.exerciseType === 'strength'
                      ? strengthExerciseSchema
                      : cardioExerciseSchema;
                  exerciseSchema
                    .validate(newExercise, { abortEarly: false })
                    .then(() => {
                      console.log('VALIDATION PASSED');
                      // Add exercise to the list if validation passes
                      setExerciseList((prev) => [...prev, newExercise]);

                      // Reset form fields after successful validation
                      setFieldValue('exerciseType', '');
                      setFieldValue('exercise', '');
                      setFieldValue('sets', '');
                      setFieldValue('weight', '');
                      setFieldValue('duration', null);
                      setErrors({}); // Clear any lingering errors
                    })
                    .catch((validationErrors) => {
                      console.log('VALIDATION ERRORS');
                      const errors = validationErrors.inner.reduce(
                        (acc, err) => ({
                          ...acc,
                          [err.path]: err.message,
                        }),
                        {}
                      );

                      // Filter irrelevant errors based on exerciseType
                      // const filteredErrors = {};
                      // if (values.exerciseType === 'strength') {
                      //   if (allErrors.duration) delete allErrors.duration;
                      // } else if (values.exerciseType === 'cardio') {
                      //   if (allErrors.sets) delete allErrors.sets;
                      //   if (allErrors.weight) delete allErrors.weight;
                      // }

                      // Set filtered errors to Formik's error state
                      setErrors(errors);
                    });
                }}
              >
                Add Exercise
              </Button>

              <List sx={{ mt: 2 }}>
                {exerciseList.map((exercise, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setExerciseList((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={exercise.exercise}
                      secondary={`Type: ${exercise.exerciseType}, ${
                        exercise.exerciseType === 'strength'
                          ? `Sets: ${exercise.sets}, Weight: ${exercise.weight}kg`
                          : `Duration: ${exercise.duration}`
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                startIcon={popupType === 'new' ? <AddIcon /> : <EditIcon />}
                endIcon={
                  isSubmitting && (
                    <CircularProgress color="secondary" size={18} />
                  )
                }
              >
                {popupType === 'new' ? 'Add Workout' : 'Edit Workout'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
