import { SInterpolationAnalyst } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'

/**
 * 半变异函数
 * @param language
 * @returns {[*,*]}
 */
function getSearchMethod(language, type) {
  const method = [
    {
      key: getLanguage(language).Analyst_Params.SEARCH_VARIABLE_LENGTH,
      value: SInterpolationAnalyst.SearchMode.KDTREE_FIXED_COUNT,
    },
    {
      key: getLanguage(language).Analyst_Params.SEARCH_FIXED_LENGTH,
      value: SInterpolationAnalyst.SearchMode.KDTREE_FIXED_RADIUS,
    },
  ]
  if (type === getLanguage(language).Analyst_Params.ORDINARY_KRIGING) {
    method.push({
      key: getLanguage(language).Analyst_Params.SEARCH_BLOCK,
      value: SInterpolationAnalyst.SearchMode.QUADTREE,
    })
  }
  return method
}

/**
 * 半变异函数
 * @param language
 * @returns {[*,*]}
 */
function getSemivariogram(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.SPHERICAL_FUNCTION,
      value: SInterpolationAnalyst.VariogramMode.SPHERICAL,
    },
    {
      key: getLanguage(language).Analyst_Params.EXPONENTIAL,
      value: SInterpolationAnalyst.VariogramMode.EXPONENTIAL,
    },
    {
      key: getLanguage(language).Analyst_Params.GAUSSIAN,
      value: SInterpolationAnalyst.VariogramMode.GAUSSIAN,
    },
  ]
}

export default {
  getSearchMethod,
  getSemivariogram,
}
