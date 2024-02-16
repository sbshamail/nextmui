// import { API } from '../../../../config'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchData as fetchVisaBooking } from './visaBooking'

// console.log(API)
// ** Axios Imports
import axios from 'axios'

const toQueryString = params => {
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return query
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appPassports/fetchData', async params => {
  const queryString = toQueryString(params)
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/passports?${queryString}`)
  // console.log(response)

  return response.data
})

// ** Add Passport
export const addPassport = createAsyncThunk(
  'appPassports/addPassport',
  async (data, { dispatch }) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/passport/create`, data)
    dispatch(
      fetchVisaBooking({
        limit: 20,
        page: 1
      })
    )

    return response.data
  }
)

export const editPassport = createAsyncThunk(
  'appPassports/editPassport',
  async (data, { dispatch }) => {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/passport/update`, data)
    dispatch(
      fetchData({
        limit: 20,
        page: 1
      })
    )

    return response.data
  }
)

// ** Delete User
// export const deleteUser = createAsyncThunk(
//   'appUsers/deleteUser',
//   async (id: number | string, { getState, dispatch }: Redux) => {
//     const response = await axios.delete('/apps/users/delete', {
//       data: id
//     })
//     dispatch(fetchData(getState().user.params))

//     return response.data
//   }
// )

export const appPassportsSlice = createSlice({
  name: 'appPassports',
  initialState: {
    data: [],
    total: 0,
    isLoading: false,
    isError: false
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.pending, state => {
      state.isLoading = true
      state.isError = false
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.isLoading = false
      state.isError = false
    })
    builder.addCase(fetchData.rejected, state => {
      state.isLoading = false
      state.isError = true
    })
  }
})

export default appPassportsSlice.reducer
