import './login.scss'
import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Flex } from 'antd'
import { userLoginService } from '../../api/user'
import { useDispatch } from 'react-redux'
import { setToken, getUserInfo } from '../../store/modules/todollist'
import { useNavigate } from 'react-router-dom'
const Login: React.FC = () => {
  //a
  //b
  //ccc
  //ddd
  //e
  //f
  //一
  //二
  const navigate = useNavigate()
  const dispatch: any = useDispatch()
  const onFinish = async (values: any) => {
    let res = await userLoginService({
      username: values.username,
      password: values.password
    })
    console.log('打印登录信息', res.data)
    dispatch(setToken(res.data.token))
    // const token = useSelector((state: any) => state.todoStore.token)
    // console.log('打印token是否延迟', token)
    await dispatch(getUserInfo(values.username))

    navigate('/')
  }

  return (
    <div className="login">
      <div className="form">
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ width: '400px' }}
          onFinish={onFinish}
        >
          <Form.Item>
            <div className="form_title">小番茄后台</div>
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
