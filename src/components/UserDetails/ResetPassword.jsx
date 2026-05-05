'use client'
import { changePassword } from '@/utils/actions/usersCrud'
import useToggle from '@/utils/hooks/use-toggle'
import React from 'react'
import { ToastContext } from '../ToastProvider'

import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Text,
  TextField
} from '@radix-ui/themes'
import { Eye, EyeOff } from 'lucide-react'
import HelperCard from '../HelperCard'

export default function ResetPassword({ username }) {
  const id = React.useId()
  const [newPassword, setNewPassword] = React.useState('')
  const [passwordsNoMatch, setPassowrdsNoMatch] = React.useState(false)
  const [newPassInvalid, setNewPassInvalid] = React.useState(false)
  const [confirmPassInvalid, setConfirmPassInvalid] = React.useState(false)
  const { createToast } = React.useContext(ToastContext)
  const [open, toggle] = useToggle()
  const [showCP, toggleShowCP] = useToggle() // toggle b/w input types for "current-password"
  const [showNP, toggleShowNP] = useToggle() // toggle b/w input types for "new-password"
  const [showCoP, toggleShowCoP] = useToggle() // toggle b/w input types for "confirm-password"

  const [formState, formAction, isPending] = React.useActionState(
    changePassword,
    null
  )

  React.useEffect(() => {
    if (formState?.success) {
      createToast('Password changed', 'success')
      toggle()
    }
    if (formState?.message) {
      createToast(formState.message, 'error')
    }
  }, [formState])

  function validatePassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
    return regex.test(password)
  }

  function handleNewPasswordChange(e) {
    const newPass = e.target.value
    setNewPassword(newPass)
    const isPasswordValid = validatePassword(newPass)
    if ((newPass.length > 0 && isPasswordValid) || newPass.length === 0) {
      setNewPassInvalid(false)
    } else {
      setNewPassInvalid(true)
    }
  }

  function handleConfirmPasswordChange(e) {
    const inputValue = e.target.value

    const isPasswordValid = validatePassword(inputValue)
    if ((inputValue.length > 0 && isPasswordValid) || inputValue.length === 0) {
      setConfirmPassInvalid(false)
    } else {
      setConfirmPassInvalid(true)
    }

    if (inputValue !== newPassword) {
      setPassowrdsNoMatch(true)
    } else {
      setPassowrdsNoMatch(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!passwordsNoMatch && !confirmPassInvalid && !newPassInvalid) {
      const fd = new FormData(e.target)
      React.startTransition(async () => formAction(fd))
    }
  }

  return (
    <>
      <AlertDialog.Root open={open}>
        <AlertDialog.Trigger>
          <Button variant="surface" onClick={toggle} color="yellow">
            Reset Password
          </Button>
        </AlertDialog.Trigger>

        <AlertDialog.Content>
          <AlertDialog.Title>Reset Password</AlertDialog.Title>
          <AlertDialog.Description size={'2'}>
            <Text>
              To reset your password, please enter your current password and
              choose a new one.
              <br />
              Make sure your new password is strong and secure to help protect
              your account.
            </Text>
          </AlertDialog.Description>

          <Flex
            asChild
            align={'center'}
            justify={'center'}
            direction={'column'}
            py={'2'}
          >
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="username" value={username} />
              {/* current password */}
              <Flex direction={'column'} width={'100%'} mb={'3'}>
                <Text as="label" htmlFor={`${id}-current-password`} size={'2'}>
                  Current Password
                </Text>
                <TextField.Root
                  id={`${id}-current-password`}
                  name="current-password"
                  type={showCP ? 'text' : 'password'}
                  required
                >
                  <TextField.Slot side="right">
                    <IconButton
                      size={'1'}
                      variant="ghost"
                      color="gray"
                      highContrast
                      onClick={toggleShowCP}
                      type="button"
                    >
                      {showCP ? (
                        <Eye size={'16px'} color="black" />
                      ) : (
                        <EyeOff size={'16px'} color="black" />
                      )}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
              </Flex>

              {/* new password */}
              <Flex direction={'column'} width={'100%'} mb={'3'}>
                <Flex align={'center'} justify={'between'}>
                  <Flex align={'center'}>
                    <Text as="label" htmlFor={`${id}-new-password`} size={'2'}>
                      New Password
                    </Text>
                    <HelperCard
                      message={
                        'Password must contain: atleast one lowercase letter, one uppercase letter, one number, one symbol and should be 8-16 characters long.'
                      }
                    />
                  </Flex>
                  {newPassInvalid && (
                    <Text color="red" size={'2'}>
                      Invalid Pattern
                    </Text>
                  )}
                </Flex>
                <TextField.Root
                  id={`${id}-new-password`}
                  name="new-password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  type={showNP ? 'text' : 'password'}
                  required
                >
                  <TextField.Slot side="right">
                    <IconButton
                      size={'1'}
                      variant="ghost"
                      color="gray"
                      highContrast
                      onClick={toggleShowNP}
                      type="button"
                    >
                      {showNP ? (
                        <Eye size={'16px'} color="black" />
                      ) : (
                        <EyeOff size={'16px'} color="black" />
                      )}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
              </Flex>

              {/* confirm password */}
              <Flex direction={'column'} width={'100%'} mb={'3'}>
                <Flex align={'center'} justify={'between'}>
                  <Text
                    as="label"
                    htmlFor={`${id}-confirm-password`}
                    size={'2'}
                  >
                    Confirm Password
                  </Text>

                  {confirmPassInvalid && (
                    <Text color="red" size={'2'}>
                      Invalid Pattern
                    </Text>
                  )}
                </Flex>
                <TextField.Root
                  id={`${id}-confirm-password`}
                  name="confirm-password"
                  color={passwordsNoMatch ? 'red' : ''}
                  onChange={handleConfirmPasswordChange}
                  type={showCoP ? 'text' : 'password'}
                  required
                >
                  {passwordsNoMatch && (
                    <TextField.Slot side="right">
                      <HelperCard
                        message={"Passwords don't match"}
                        variant="error"
                      />
                    </TextField.Slot>
                  )}
                  <TextField.Slot side="right">
                    <IconButton
                      size={'1'}
                      variant="ghost"
                      color="gray"
                      highContrast
                      onClick={toggleShowCoP}
                      type="button"
                    >
                      {showCoP ? (
                        <Eye size={'16px'} color="black" />
                      ) : (
                        <EyeOff size={'16px'} color="black" />
                      )}
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
              </Flex>

              <Flex gap="3" mt="4" justify="end" width={'100%'}>
                <Button
                  variant="soft"
                  type="button"
                  color="gray"
                  onClick={() => {
                    setNewPassword('')
                    setPassowrdsNoMatch(false)
                    setConfirmPassInvalid(false)
                    setNewPassInvalid(false)
                    toggle()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  loading={isPending}
                  color="iris"
                  type="submit"
                >
                  Change Password
                </Button>
              </Flex>
            </form>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}
