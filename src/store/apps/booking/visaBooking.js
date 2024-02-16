import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

const toQueryString = params => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

// ** Fetch Visa Booking
export const fetchData = createAsyncThunk('appVisaBooking/fetchData', async params => {
  const queryString = toQueryString(params)
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/visa-booking?${queryString}`)

  // console.log(response)
  return response.data
})

// ** Add Passport
// export const addPassport = createAsyncThunk(
//   'appVisaService/addVisaService',
//   async (data: FormData, { dispatch }: Redux) => {
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/passport/create`, data)
//     dispatch(
//       fetchData({
//         limit: 20,
//         page: 1
//       })
//     )

//     return response.data
//   }
// )

// export const editPassport = createAsyncThunk(
//   'appPassports/editPassport',
//   async (data: FormData, { dispatch }: Redux) => {
//     const response = await axios.put(`${process.env.NEXT_PUBLIC_API}/passport/update`, data)
//     dispatch(
//       fetchData({
//         limit: 20,
//         page: 1
//       })
//     )

//     return response.data
//   }
// )

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

export const appVisaBookingSlice = createSlice({
  name: 'appVisaBooking',
  initialState: {
    data: [],
    total: 1,
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

export default appVisaBookingSlice.reducer
