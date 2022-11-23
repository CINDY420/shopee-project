export const WORD = /^[a-zA-Z0-9_\-]+$/
export const WORD_WITHOUT_UNDER_SCORE = /^[a-zA-Z0-9\-]+$/
export const WORD_WITHOUT_UNDER_SCORE_LOWER_CASE = /^[a-z0-9\-]+$/

export const URL = /(http|https):\/\/([\w.]+\/?)\S*/

export const K8S_NAME = /^[a-zA-Z]+[0-9a-zA-Z-]*[a-zA-Z0-9]+$/

export const START_WITH_LOWER_ALPHA = /^[a-z]+/
export const START_WITH_LOWER_ALPHA_NUMERIC = /^[a-z0-9]+/
export const START_WITH_ALPHA = /^[a-zA-Z]+/
export const START_WITH_ALPHA_NUMERIC = /^[a-zA-Z0-9]+/
export const ONLY_LOWER_WORD = /^[a-z0-9\-]+$/
export const END_WITH_LOWER_ALPHA_NUMERIC = /[a-z0-9]+$/
export const END_WITH_ALPHA_NUMERIC = /[a-zA-Z0-9]+$/
export const ONLY_LOWER_ALPHA_NUMERIC = /^[a-z0-9]+$/
export const LOWER_WILDCARD_WORD =
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/
export const SELECTOR_WILDCARD_WORD = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/
export const WILDCARD_SUFFIX = /^[^@]*(@(cid|env|domain_cid_suffix|domain_env_flag)[^@]*)*$/
export const CLUSTER_TAINT_WORD = /^[a-zA-Z0-9\-\.\_]+$/
export const CLUSTER_TAINT_KEY = /^[a-zA-Z0-9\-\.\_\/]+$/
export const QUOTAS_DECIMAL_CHECK = /^\d+(\.\d{1,2})?$/
export const GIT_REPO_CHECK = /^gitlab@[^:]+:[^\/]+?\/.*?.git$/

export const formRuleMessage = {
  START_WITH_LOWER_ALPHA: 'Must start with lowercase alpha a-z.',
  START_WITH_LOWER_ALPHA_NUMERIC: 'Must start with lowercase alpha a-z or 0-9.',
  START_WITH_ALPHA: 'Must start with alpha a-z or A-Z.',
  START_WITH_ALPHA_NUMERIC: 'Must start with alpha a-z, A-Z or 0-9.',
  END_WITH_LOWER_ALPHA_NUMERIC: 'Must end with lowercase alphanumeric a-z or 0-9.',
  END_WITH_ALPHA_NUMERIC: 'Must end with alphanumeric a-z, A-Z or 0-9.',
  ONLY_LOWER_WORD: "Can only contain lowercase alphanumeric(a-z0-9) and '-'",
  ONLY_LOWER_ALPHA_NUMERIC: 'Can only contain lowercase alphanumeric(a-z0-9).',
  LOWER_WILDCARD_WORD: "Can only contain lowercase alphanumeric(a-z0-9), '-', '.' and '@'.",
  SELECTOR_WILDCARD_WORD: "Can only contain alphanumeric(a-zA-Z0-9), '-', '_', '.' and '@'.",
  CLUSTER_TAINT_WORD: "Can only contain alphanumeric(a-zA-Z0-9), '-', '.' and '_'.",
  CLUSTER_TAINT_KEY: "Can only contain alphanumeric(a-zA-Z0-9), '-', '.', '/' and '_'.",
  WILDCARD_SUFFIX: "Only '@cid', '@env', '@domain_env_flag', '@domain_cid_suffix' can be used.",
  MAX_LENGTH_31: 'Must be less than or equal to 31 characters',
  MAX_LENGTH_63: 'Must be less than or equal to 63 characters',
  MIN_LENGTH: 'Must be more than 1 character',
  maxLength: (maxLength: number) => `Must be less than or equal to ${maxLength} characters`,
  INTEGER_NUMBER_OR_PERCENTAGE: 'Integer number or percentage only.',
  TWO_DECIMAL_PLACES_LIMIT: 'Only allow two decimal places',
}

export const INTEGER_NUMBER_OR_PERCENTAGE = /^([0-9])+(%)?$/
export const INTEGER_NUMBER = /^[1-9]\d*$/
export const NON_NEGATIVE_NUMBER = /^[1-9]\d*$|^0$/
export const PERCENTAGE = /^(100|[1-9]\d|\d)%$/
export const NON_ZERO_PERCENTAGE = /^[1-9][0-9]?%$|^100%$/
export const INTEGER_NUMBER_OR_LTIMIED_PERCENTAGE = /^(100|[1-9]\d|\d)%$|^\d+$/
export const ZERO_TO_ONE = /^(0(\.\d+)?|1(\.0+)?)$/
export const ZERO_TO_ONE_HUNDRED = /^[1-9][0-9]?$|^100$/
interface IRule {
  regex: RegExp
  errorMessage: string
}
/**
 * Validates a string value against a series of validation regex expressions
 * return the error message if specified
 * @param value value needed to be validated
 * @param rules rules used to validated
 */
export const validateRules = (value: string, rules: IRule[]): string => {
  const mismatchedRule = rules.find((rule) => !rule.regex.test(value))
  if (mismatchedRule) {
    return mismatchedRule.errorMessage
  }
}
