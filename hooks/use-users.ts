import { useEffect, useRef, useState } from 'react'
import { getCsvUri, getUsers, GetUsersRequest, User } from '../api/users'

const useUsers = (initialData: Omit<GetUsersRequest, 'page'>) => {
  const page = useRef(1)
  const isFetching = useRef(false)

  const [users, setUsers] = useState<User[]>([])

  const downloadCsv = async (data: Omit<GetUsersRequest, 'page'>) => {
    const csv = await getCsvUri({ ...data, page: page.current })

    const link = document.createElement('a')
    link.setAttribute('href', csv!)
    link.setAttribute('download', `${new Date().toLocaleString()}.csv`)
    document.body.append(link)
    link.click()
  }

  const fetchUsers = async (
    data: Omit<GetUsersRequest, 'page'>,
    clean?: true,
  ) => {
    if (!isFetching.current) {
      isFetching.current = true

      if (clean) {
        page.current = 1
      }

      const result = await getUsers({ ...data, page: page.current })

      if (!result) {
        return
      }

      page.current++

      if (clean) {
        setUsers(result.users)
      } else {
        setUsers([...users, ...result.users])
      }

      isFetching.current = false
    }
  }

  useEffect(() => {
    setUsers([])
    page.current = 1
    fetchUsers(initialData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { users, fetchUsers, downloadCsv }
}

export default useUsers
