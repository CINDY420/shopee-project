import * as React from 'react'
import * as R from 'ramda'
import { actionCreator } from 'helpers/reducer'
import { swapItemsInArr, replaceItemInArr, removeItemInArr } from 'helpers/array'

// TODO more interface details
export const PipelineContext = React.createContext({})

export const pipelineReducer = (state, { type, payload }) => {
  switch (type) {
    case ACTION_TYPES.MOVE_STAGE_UP: {
      const index = payload.index
      if (index === 0) {
        break
      }

      return {
        ...state,
        stages: swapItemsInArr(state.stages, index - 1, index)
      }
    }
    case ACTION_TYPES.MOVE_STAGE_DOWN: {
      const index = payload.index
      if (index === state.stages.length - 1) {
        break
      }

      return {
        ...state,
        stages: swapItemsInArr(state.stages, index, index + 1)
      }
    }
    case ACTION_TYPES.ADD_STAGE: {
      return {
        ...state,
        stages: [...state.stages, { name: '', steps: [] }]
      }
    }
    case ACTION_TYPES.REMOVE_STAGE: {
      return {
        ...state,
        stages: removeItemInArr(state.stages, payload.index)
      }
    }
    case ACTION_TYPES.UPDATE_STAGE: {
      const oldStage = state.stages[payload.index]
      const newStage = { ...oldStage }
      if (payload.name) {
        newStage.name = payload.name
      }
      if (payload.steps) {
        newStage.steps = payload.steps
      }

      return {
        ...state,
        stages: replaceItemInArr(state.stages, payload.index, newStage)
      }
    }
    case ACTION_TYPES.MOVE_STEP_UP: {
      const stepIndex = payload.index
      if (stepIndex === 0) {
        break
      }
      const oldStage = state.stages[payload.stageIndex]

      return {
        ...state,
        stages: replaceItemInArr(state.stages, payload.stageIndex, {
          ...oldStage,
          steps: swapItemsInArr(oldStage.steps, stepIndex - 1, stepIndex)
        })
      }
    }
    case ACTION_TYPES.MOVE_STEP_DOWN: {
      const stepIndex = payload.index
      const oldStage = state.stages[payload.stageIndex]
      if (stepIndex === oldStage.steps.length - 1) {
        break
      }

      return {
        ...state,
        stages: replaceItemInArr(state.stages, payload.stageIndex, {
          ...oldStage,
          steps: swapItemsInArr(oldStage.steps, stepIndex, stepIndex + 1)
        })
      }
    }
    case ACTION_TYPES.ADD_STEP: {
      const stageIndex = payload.stageIndex
      const oldStage = state.stages[stageIndex]
      return {
        ...state,
        stages: replaceItemInArr(state.stages, stageIndex, {
          ...oldStage,
          steps: [...oldStage.steps, { name: payload.name, value: payload.value }]
        })
      }
    }
    case ACTION_TYPES.REMOVE_STEP: {
      const stageIndex = payload.stageIndex
      const oldStage = state.stages[stageIndex]
      const stepIndex = payload.index

      return {
        ...state,
        stages: replaceItemInArr(state.stages, stageIndex, {
          ...oldStage,
          steps: removeItemInArr(oldStage.steps, stepIndex)
        })
      }
    }
    case ACTION_TYPES.UPDATE_STEP: {
      const stageIndex = payload.stageIndex
      const stepIndex = payload.index
      const oldStage = state.stages[stageIndex]
      const oldStep = oldStage.steps[stepIndex]
      const newStep = { ...oldStep }
      const name = payload.name
      const value = payload.value

      if (name) {
        newStep.name = name
      }
      if (value) {
        newStep.value = value
      }

      return {
        ...state,
        stages: replaceItemInArr(state.stages, stageIndex, {
          ...oldStage,
          steps: replaceItemInArr(oldStage.steps, stepIndex, newStep)
        })
      }
    }
    case ACTION_TYPES.REPLACE_PIPELINE: {
      return R.clone(payload.pipeline)
    }
    case ACTION_TYPES.REPLACE_STAGE: {
      return {
        ...state,
        stages: replaceItemInArr(state.stages, payload.index, R.clone(payload.stage))
      }
    }
    case ACTION_TYPES.REPLACE_STEP: {
      const stageIndex = payload.stageIndex
      const oldStage = state.stages[stageIndex]

      return {
        ...state,
        stages: replaceItemInArr(state.stages, payload.stageIndex, {
          ...oldStage,
          steps: replaceItemInArr(oldStage.steps, payload.index, payload.step)
        })
      }
    }
    case ACTION_TYPES.CHANGE_PIPELINE_NAME: {
      const name = payload.name
      return {
        ...state,
        name
      }
    }
  }

  return state
}

export const ACTION_TYPES = {
  MOVE_STAGE_UP: 'MOVE_STAGE_UP',
  MOVE_STAGE_DOWN: 'MOVE_STAGE_DOWN',
  REMOVE_STAGE: 'REMOVE_STAGE',
  ADD_STAGE: 'ADD_STAGE',
  UPDATE_STAGE: 'UPDATE_STAGE',
  MOVE_STEP_UP: 'MOVE_STEP_UP',
  MOVE_STEP_DOWN: 'MOVE_STEP_DOWN',
  REMOVE_STEP: 'REMOVE_STEP',
  UPDATE_STEP: 'UPDATE_STEP',
  ADD_STEP: 'ADD_STEP',
  REPLACE_PIPELINE: 'REPLACE_PIPELINE',
  REPLACE_STAGE: 'REPLACE_STAGE',
  REPLACE_STEP: 'REPLACE_STEP',
  CHANGE_PIPELINE_NAME: 'CHANGE_PIPELINE_NAME'
}

export const moveStageUp = dispatch => ({ index }) => dispatch(actionCreator(ACTION_TYPES.MOVE_STAGE_UP, { index }))
export const moveStageDown = dispatch => ({ index }) => dispatch(actionCreator(ACTION_TYPES.MOVE_STAGE_DOWN, { index }))
export const removeStage = dispatch => ({ index }) => dispatch(actionCreator(ACTION_TYPES.REMOVE_STAGE, { index }))
export const addStage = dispatch => () => dispatch(actionCreator(ACTION_TYPES.ADD_STAGE, {}))
export const updateStage = dispatch => ({ index, name, steps }) =>
  dispatch(actionCreator(ACTION_TYPES.UPDATE_STAGE, { index, name, steps }))
export const moveStepUp = dispatch => ({ stageIndex, index }) =>
  dispatch(actionCreator(ACTION_TYPES.MOVE_STEP_UP, { stageIndex, index }))
export const moveStepDown = dispatch => ({ stageIndex, index }) =>
  dispatch(actionCreator(ACTION_TYPES.MOVE_STEP_DOWN, { stageIndex, index }))
export const removeStep = dispatch => ({ stageIndex, index }) =>
  dispatch(actionCreator(ACTION_TYPES.REMOVE_STEP, { stageIndex, index }))
export const updateStep = dispatch => ({ stageIndex, index, name, value }) =>
  dispatch(actionCreator(ACTION_TYPES.UPDATE_STEP, { stageIndex, index, name, value }))
export const addStep = dispatch => ({ stageIndex, name, value }) =>
  dispatch(actionCreator(ACTION_TYPES.ADD_STEP, { stageIndex, name, value }))
export const replacePipeline = dispatch => ({ pipeline }) =>
  dispatch(actionCreator(ACTION_TYPES.REPLACE_PIPELINE, { pipeline }))
export const replaceStage = dispatch => ({ index, stage }) =>
  dispatch(actionCreator(ACTION_TYPES.REPLACE_STAGE, { index, stage }))
export const replaceStep = dispatch => ({ stageIndex }) =>
  dispatch(actionCreator(ACTION_TYPES.REPLACE_STEP, { stageIndex }))
export const changePipelineName = dispatch => ({ name }) =>
  dispatch(actionCreator(ACTION_TYPES.CHANGE_PIPELINE_NAME, { name }))
