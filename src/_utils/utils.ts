// import { zlibSync, unzlibSync, strToU8, strFromU8 } from 'fflate'

// export const genLink = (pkg: string, version?: string, file = ''): string => {
//   const ver = version ? `@${version}` : ''
//   return `https://unpkg.com/${pkg}${ver}${file}`
// }

// export const genVueLink = (version = '3.2.36'): Record<string, string> => {
//   const compilerSfc = genLink(
//     '@vue/compiler-sfc',
//     version,
//     '/dist/compiler-sfc.esm-browser.js'
//   )
//   const runtimeDom = genLink(
//     '@vue/runtime-dom',
//     version,
//     '/dist/runtime-dom.esm-browser.js'
//   )

//   return {
//     compilerSfc,
//     runtimeDom
//   }
// }
// export const decodeData = (base64: string): string => {
//   return decodeURIComponent(escape(atob(base64)))
// }

// export function atou (base64: string): string {
//   const binary = atob(base64)

//   // zlib header (x78), level 9 (xDA)
//   if (binary.startsWith('\x78\xDA')) {
//     const buffer = strToU8(binary, true)
//     const unzipped = unzlibSync(buffer)
//     return strFromU8(unzipped)
//   }

//   // old unicode hacks for backward compatibility
//   // https://base64.guru/developers/javascript/examples/unicode-strings
//   return decodeURIComponent(escape(binary))
// }

// // 对查询关键字中的特殊字符进行编码
// function encodeSearchKey (key) {
//   const encodeArr = [{
//     code: '%',
//     encode: '%25'
//   }, {
//     code: '?',
//     encode: '%3F'
//   }, {
//     code: '#',
//     encode: '%23'
//   }, {
//     code: '&',
//     encode: '%26'
//   }, {
//     code: '=',
//     encode: '%3D'
//   }];
//   return key.replace(/[%?#&=]/g, ($, index, str) => {
//     for (const k of encodeArr) {
//       if (k.code === $) {
//         return k.encode;
//       }
//     }
//   });
// }

import { zlibSync, unzlibSync, strToU8, strFromU8 } from 'fflate'

// prefer old unicode hacks for backward compatibility
// https://base64.guru/developers/javascript/examples/unicode-strings
export function utoa (data: string): string {
  return btoa(unescape(encodeURIComponent(data)))
}

const encodeSearchKey = function (key) {
  const encodeArr = [{
    code: '%',
    encode: '%25'
  }, {
    code: '?',
    encode: '%3F'
  }, {
    code: '#',
    encode: '%23'
  }, {
    code: '&',
    encode: '%26'
  }, {
    code: '=',
    encode: '%3D'
  }];
  return key.replace(/[%?#&=]/g, ($, index, str) => {
    for (const k of encodeArr) {
      if (k.code === $) {
        return k.encode;
      }
    }
  });
}

// export function atou (base64: string): string {
//   // return decodeURIComponent(escape(atob(base64)).replace(/%/g, '%25'))
//   return decodeURIComponent(escape(atob(base64)))
// }

export function atou (base64: string): string {
  const binary = atob(base64)

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary))
}
