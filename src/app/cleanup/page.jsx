'use client'

import ResponsiveContainer from '@/components/RespContainer'
import { ToastContext } from '@/components/ToastProvider'
import { cleanUpNonAdminUsers } from '@/utils/actions/usersCrud'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit
} from '@radix-ui/react-form'
import { Box, Button, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CleanUpDBPage() {
  return (
    <>
      <ResponsiveContainer width={{ md: '60%', lg: '50%' }}>
        <Box asChild mt={'9'} mb={'8'}>
          <Heading
            align={'center'}
            size={{ md: '9', xs: '8' }}
            weight={'regular'}
          >
            Enter Cleanup Password:
          </Heading>
        </Box>
        <Flex
          align={'center'}
          justify={'center'}
          direction={'column'}
          width={{ sm: '60%' }}
          maxWidth={{ initial: '480px', sm: 'none' }}
          mx={'auto'}
        >
          <PasswordForm />
        </Flex>
      </ResponsiveContainer>
    </>
  )
}

function PasswordForm() {
  const [formState, formAction, isPending] = React.useActionState(
    cleanUpNonAdminUsers,
    null
  )
  const { createToast } = React.useContext(ToastContext)
  const router = useRouter()

  React.useEffect(() => {
    if (formState?.message && formState.serverError) {
      createToast(formState.message, 'error')
    }

    if (formState?.success) {
      createToast(formState.message, 'success')
    }
  }, [formState])

  return (
    <Flex
      asChild
      direction={'column'}
      align={'center'}
      justify={'center'}
      gapY={'4'}
      width={'100%'}
      pb={'8'}
    >
      <Form action={formAction}>
        <Box asChild width={'100%'}>
          <FormField name="password">
            <Flex justify={'between'}>
              <Text asChild size={'2'}>
                <FormLabel>Enter password</FormLabel>
              </Text>
              <Text asChild weight={'regular'} size={'2'}>
                <FormMessage match={'valueMissing'}></FormMessage>
              </Text>
            </Flex>
            <FormControl asChild>
              <TextField.Root disabled={isPending} type="password" required />
            </FormControl>
          </FormField>
        </Box>

        <Flex width={'100%'} justify={'end'} gap={'5'}>
          <Button
            disabled={isPending}
            color="red"
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <FormSubmit asChild>
            <Button loading={isPending} color="gray" highContrast>
              {isPending ? 'Processing...' : 'Submit'}
            </Button>
          </FormSubmit>
        </Flex>
      </Form>
    </Flex>
  )
}
