import React from 'react'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

const SelectField = ({ options, label, placeholder, value, setValue, disableClearable }) => {
  return (
    <CustomAutocomplete
      sx={{ mb: 4 }}
      options={options ? options : ['xyz', 'xyz']}
      id='autocomplete-size-medium'
      value={value}
      getOptionLabel={option => option.toUpperCase() || ''}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      disableClearable={disableClearable}
      renderInput={params => (
        <CustomTextField {...params} size='small' label={label} placeholder={placeholder} />
      )}
    />
  )
}

export default SelectField
