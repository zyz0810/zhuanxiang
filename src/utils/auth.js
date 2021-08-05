import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// export function getToken() {
//   return localStorage.getItem('TokenKey')
// }
//
// export function setToken(value) {
//   return localStorage.setItem("TokenKey", value);
// }
//
// export function removeToken() {
//   return localStorage.removeItem('TokenKey')
// }

const IdKey = 'id';
export function getId() {
  return Cookies.get(IdKey)
}

export function setId(token) {
  return Cookies.set(IdKey, token)
}

export function removeId() {
  return Cookies.remove(IdKey)
}

const NameKey = 'name';
export function getName() {
  return Cookies.get(NameKey)
}

export function setName(token) {
  return Cookies.set(NameKey, token)
}

export function removeName() {
  return Cookies.remove(NameKey)
}
const Role = 'role';
export function getRole() {
  return JSON.parse(localStorage.getItem(Role))
  // return Cookies.get(Role)
}
export function setRole(role) {
  return localStorage.setItem(Role,JSON.stringify(role))
  // return Cookies.set(Role, JSON.stringify(role))
}

export function removeRole() {
  return localStorage.removeItem(Role)
  // return Cookies.remove(Role)
}

const adminMobile = 'admin_Mobile';
export function getMobile() {
  return Cookies.get(adminMobile)
}
export function setMobile(mobile) {
  return Cookies.set(adminMobile, mobile)
}

export function removeMobile() {
  return Cookies.remove(adminMobile)
}

const city = 'city';
export function setCity(cityList) {
  return localStorage.setItem('city',JSON.stringify(cityList))
  // return Cookies.set(city, cityList)
}
export function getCity() {
  return JSON.parse(localStorage.getItem('city'))
  // return Cookies.get(city)
}
export function removeCity() {
  return localStorage.removeItem('city')
  // return Cookies.remove(city)
}

const CitySelected = 'citySelected';
export function setCitySelected(cityCurrent) {
  // return localStorage.setItem('citySelected',cityCurrent))
  return Cookies.set(CitySelected, cityCurrent)
}
export function getCitySelected() {
  // return JSON.parse(localStorage.getItem('city'))
  return Cookies.get(CitySelected)
}
export function removeCitySelected() {
  // return localStorage.removeItem('city')
  return Cookies.remove(CitySelected)
}
