import { SInterpolationAnalyst } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'

/**
 * 插值方法
 * @param language
 * @returns {[*,*]}
 */
function getInterpolationMethod(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.IDW,
      value: SInterpolationAnalyst.InterpolationAlgorithmType.IDW,
    },
    {
      key: getLanguage(language).Analyst_Params.SPLINE,
      value: SInterpolationAnalyst.InterpolationAlgorithmType.RBF,
    },
    {
      key: getLanguage(language).Analyst_Params.ORDINARY_KRIGING,
      value: SInterpolationAnalyst.InterpolationAlgorithmType.KRIGING,
    },
    {
      key: getLanguage(language).Analyst_Params.SIMPLE_KRIGING,
      value: SInterpolationAnalyst.InterpolationAlgorithmType.SimpleKRIGING,
    },
    {
      key: getLanguage(language).Analyst_Params.UNIVERSAL_KRIGING,
      value: SInterpolationAnalyst.InterpolationAlgorithmType.UniversalKRIGING,
    },
  ]
}

function getPixelFormat(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.UBIT1,
      value: SInterpolationAnalyst.PixelFormat.UBIT1,
    },
    {
      key: getLanguage(language).Analyst_Params.UBIT16,
      value: SInterpolationAnalyst.PixelFormat.UBIT16,
    },
    {
      key: getLanguage(language).Analyst_Params.UBIT32,
      value: SInterpolationAnalyst.PixelFormat.BIT32,
    },
    {
      key: getLanguage(language).Analyst_Params.SINGLE_FLOAT,
      value: SInterpolationAnalyst.PixelFormat.SINGLE,
    },
    {
      key: getLanguage(language).Analyst_Params.DOUBLE,
      value: SInterpolationAnalyst.PixelFormat.DOUBLE,
    },
  ]
}

export default {
  getInterpolationMethod,
  getPixelFormat,
}
