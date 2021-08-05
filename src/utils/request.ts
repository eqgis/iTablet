interface RequestParams {
  body?: {[name: string]: any},
  headers?: {[name: string]: any},
}
export default function request(url: string, method = 'GET', { body, headers }: RequestParams) {
  let extraData = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method,
  }

  if (headers) {
    extraData.headers = Object.assign(extraData.headers, headers)
  }

  if (method === 'POST' && body) {
    extraData = Object.assign(extraData, { body: JSON.stringify(body) })
  }

  if (method === 'PUT' && body) {
    extraData = Object.assign(extraData, { body: JSON.stringify(body) })
  }

  return fetch(url, extraData)
    .then(response => {
      const { map } = response.headers
      if (map['set-cookie']) {
        GLOBAL.cookie = map['set-cookie']
      }
      return response.json()
    })
    .then(responseJson => responseJson)
    .catch(() => {
      GLOBAL.cookie = ''
    })
}