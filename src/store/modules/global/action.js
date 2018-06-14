import { createAction } from '@/utils/createTools';

const NAME_SPACE = 'global';

export const START = `${NAME_SPACE}/START_LOADING`;
export const SUCCESS = `${NAME_SPACE}/SUCCESS_LOADING`;
export const FAILURE = `${NAME_SPACE}/FAILURE_LOADING`;

export const startLoading = () => createAction(START);
export const successLoading = () => createAction(SUCCESS);
export const failureLoading = () => createAction(FAILURE);
