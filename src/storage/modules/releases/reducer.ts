import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { ReleasesDataProps } from '@utils/Types/releasesProps'

export interface ReleasesProps {
  releases: ReleasesDataProps[]
}

const initialState: ReleasesProps = {
  releases: [],
}

const releasesSlice = createSlice({
  name: 'releases',
  initialState,
  reducers: {
    handleSetReleases(state, action: PayloadAction<ReleasesProps>) {
      state.releases = action.payload.releases
    },
  },
})

export const { handleSetReleases } = releasesSlice.actions

export default releasesSlice.reducer
