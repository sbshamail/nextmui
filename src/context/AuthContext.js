// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getReducer } from 'src/store/apps/sliceActionReducer'
// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

//actions
import {
  signin,
  signup,
  isAuth,
  authenticate,
  getCookie,
  removeAuthenticate,
  accessToken,
  setCookie
} from 'src/action/auth-action'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [auth, setAuth] = useState(null)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const dispatch = useDispatch()
  const setToken = getReducer('token')
  const setLoginUser = getReducer('loginUser')

  const loginUser = useSelector((state) => state.loginUser?.data)
  const token = useSelector((state) => state.token?.data)
  // ** Hooks
  const router = useRouter()

  // console.log(isAuth())
  // const authCheck = () => {
  //   if (isAuth()) {
  //     const accessToken = getCookie('jwt')
  //     setUser(isAuth())
  //     dispatch(setToken(accessToken))
  //     setLoading(false)
  //   } else {
  //     setLoading(false)
  //     router.replace('/login')
  //   }
  // }
  // useEffect(() => {
  //   authCheck()
  // }, [])

  useEffect(() => {
    const accessToken = getCookie('jwt')
    const initAuth = async () => {
      if (token) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            authenticate(response.data, () => {
              // console.log(response.data)
              dispatch(setToken(response.data.accessToken))
              dispatch(setLoginUser(response.data.data))
              setUser(response.data.data)
              setLoading(false)
            })
          })
          .catch(() => {
            removeAuthenticate('userData', 'jwt')
            dispatch(setToken(null))
            setUser(null)
            setLoading(false)
            router.replace('/login')
            // if (!router.pathname.includes('login')) {
            //   router.replace('/login')
            // }
          })
      } else {
        setLoading(false)
        removeAuthenticate('userData', 'jwt')
        dispatch(setToken(null))
        router.replace('/login')
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    setUser(null)
    removeAuthenticate('userData', 'jwt')
    signin(params)
      .then((response) => {
        // params.rememberMe ? authenticate(response.data) : ''
        authenticate(response.data, () => {
          dispatch(setToken(response.data.accessToken))
          dispatch(setLoginUser(response.data.data))
          setUser(response.data.data)
          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL)
        })
      })
      .catch((err) => {
        console.log('===auth context===', err)
        if (errorCallback) errorCallback(err)
      })
  }

  // const handleRegister = (params, errorCallback) => {
  //   signup(params)
  //     .then(response => {
  //       // params.rememberMe ? authenticate(response.data) : ''
  //       authenticate(response.data, () => {
  //         dispatch(setToken(response.data.accessToken))
  //         setUser(response.data.data)
  //         const returnUrl = router.query.returnUrl
  //         const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
  //         router.replace(redirectURL)
  //       })
  //     })
  //     .catch(err => {
  //       if (errorCallback) errorCallback(err)
  //     })
  // }

  const handleLogout = () => {
    setUser(null)
    removeAuthenticate('userData', 'jwt')
    dispatch(setToken(null))
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    // register: handleRegister,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
