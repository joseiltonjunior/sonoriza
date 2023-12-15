import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native'
import { useController, FieldError, Control } from 'react-hook-form'
import Icon from 'react-native-vector-icons/Feather'
import { useState } from 'react'
import MaskInput from 'react-native-mask-input'
import colors from 'tailwindcss/colors'

interface InputFormProps extends TextInputProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  icon?: string
  error?: FieldError
  password?: boolean
  mask?: (string | RegExp)[]
}

export function Input({
  control,
  name,
  icon,
  error,
  password,
  mask,
  ...rest
}: InputFormProps) {
  const { field } = useController({ name, control, defaultValue: '' })
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      <View
        className={`flex-row bg-transparent rounded-xl px-4 h-14 items-center border border-gray-400 ${
          error && 'border-red-600'
        }`}
      >
        {icon && <Icon name={icon} size={20} color={colors.gray[400]} />}
        {mask ? (
          <MaskInput
            {...rest}
            className="placeholder:text-base text-white bg-transparent flex-1"
            value={field.value}
            onChangeText={field.onChange}
            mask={mask}
          />
        ) : (
          <TextInput
            className="placeholder:text-base ml-2 text-white bg-transparent flex-1"
            placeholderTextColor={colors.gray[400]}
            value={field.value}
            onChangeText={field.onChange}
            secureTextEntry={password && isVisible ? true : !isVisible && false}
            {...rest}
          />
        )}
        {password && (
          <TouchableOpacity
            hitSlop={16}
            onPress={() => setIsVisible(!isVisible)}
            activeOpacity={0.5}
          >
            <Icon
              name={!isVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-gray-400 text-right text-xs mb-1">
        {error?.message}
      </Text>
    </>
  )
}
