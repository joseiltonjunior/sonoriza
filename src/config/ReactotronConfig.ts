import Reactotron from 'reactotron-react-native'

if (__DEV__) {
  Reactotron.configure({ name: 'sonoriza' }).useReactNative().connect()

  const yeOldeConsoleLog = console.log
  console.log = (...args) => {
    yeOldeConsoleLog(...args)
    Reactotron.display({
      name: 'CONSOLE.LOG',
      value: args,
      preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
    })
  }
}
