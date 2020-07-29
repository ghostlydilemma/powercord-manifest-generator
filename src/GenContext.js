import React from 'react'

const GenContext = React.createContext()

export const GenProvider = GenContext.Provider
export const GenConsumer = GenContext.Consumer

export default GenContext