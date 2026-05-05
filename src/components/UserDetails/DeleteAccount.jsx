'use client'
import { ToastContext } from '@/components/ToastProvider'
import { deleteUser } from '@/utils/actions/usersCrud'
import useToggle from '@/utils/hooks/use-toggle'
import {
  AlertDialog,
  Button,
  Flex,
  IconButton,
  Strong,
  Text,
  TextField
} from '@radix-ui/themes'
import { Eye, EyeOff, X } from 'lucide-react'
import React from 'react'

export default function DeleteAccount({ username }) {
  const id = React.useId()
  const [showPass, toggle] = useToggle()
  const [isVerfStrInvalid, setIsVerfStrInvalid] = React.useState(false)
  const { createToast } = React.useContext(ToastContext)
  const [formState, formAction, isPending] = React.useActionState(deleteUser)
  const verificationStr = 'delete my account'

  React.useEffect(() => {
    if (formState?.success) {
    }
    if (formState?.message) {
      createToast(formState.message, 'error')
    }
  }, [formState])

  function handleVStringChange(e) {
    const currStr = e.target.value
    if (currStr !== verificationStr) {
      setIsVerfStrInvalid(true)
    } else {
      setIsVerfStrInvalid(false)
    }
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete Account</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content maxWidth={'500px'}>
        <Flex align={'center'} justify={'between'} mb={'3'}>
          <AlertDialog.Title>
            <Text color="ruby">Delete Account</Text>
          </AlertDialog.Title>
          <AlertDialog.Cancel>
            <IconButton color="gray" highContrast variant="ghost" size={'1'}>
              <X strokeWidth={'2px'} size={'16px'} />
            </IconButton>
          </AlertDialog.Cancel>
        </Flex>

        <AlertDialog.Description mb={'3'}>
          This action is irreversible. All the data associated with this account
          will be deleted.
        </AlertDialog.Description>

        <Flex asChild direction={'column'} gapY={'4'}>
          <form action={formAction}>
            <input type="hidden" name="username" value={username} />
            {/* enter current password */}
            <Flex direction={'column'}>
              <Text as="label" htmlFor={`${id}-current-password`} size={'2'}>
                Enter Password
              </Text>
              <TextField.Root
                id={`${id}-current-password`}
                name="current-password"
                type={showPass ? 'text' : 'password'}
                required
              >
                <TextField.Slot side="right">
                  <IconButton
                    size={'1'}
                    variant="ghost"
                    color="gray"
                    highContrast
                    onClick={toggle}
                    type="button"
                  >
                    {showPass ? (
                      <Eye size={'16px'} color="black" />
                    ) : (
                      <EyeOff size={'16px'} color="black" />
                    )}
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* verification string */}
            <Flex direction={'column'}>
              <Text size={'2'}>
                To verify, type <Strong>"{verificationStr}"</Strong> below:
              </Text>
              <TextField.Root
                color={isVerfStrInvalid ? 'red' : ''}
                onChange={handleVStringChange}
                name="verification-str"
                required
              />
            </Flex>

            <Button color="red" loading={isPending}>
              Delete my account
            </Button>
          </form>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
