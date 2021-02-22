import CN from '../CN'

const RequestError: typeof CN.RequestError = {
  ERROR_400: 'طلب غير صالح',
  ERROR_401: 'لاتوجد صلاحيه للوصول',
  // ERROR_402: 'يتطلب دفع',
  // ERROR_403: 'ممنوع',
  ERROR_404: 'غير موجود',
  // ERROR_405: 'الطريقة غير مسموحة بها',
  // ERROR_406: 'غير مقبول',
  ERROR_407: 'ليس لديك الإذن',
  ERROR_408: 'انتهاء زمن الطلب',
}

export {
  RequestError,
}