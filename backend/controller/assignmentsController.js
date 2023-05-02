import dotenv from 'dotenv'
dotenv.config()
import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { axios } from 'axios'

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION })

export const getReminders = async (req, res) => {
  const options = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`
    }
  }
  const profile = await coursevilleUtils.getProfileInformation(options)
  const params = {
    TableName: process.env.AWS_ASSIGNMENT_TABLE_NAME,
    FilterExpression: 'user_id = :id',
    ExpressionAttributeValues: {
      ':id': profile.user.id
    }
  }
  try {
    const reminders = await docClient.send(new ScanCommand(params))
    res.send(reminders.Items)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}

export const addReminder = async (req, res) => {
  const options = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`
    }
  }
  const profile = await coursevilleUtils.getProfileInformation(options)
  const reminder_id = uuidv4()
  const created_date = Date.now()
  const reminder = {
    user_id: profile.user.id,
    reminder_id: reminder_id,
    ...req.body,
    created_date: created_date
  }

  const params = {
    TableName: process.env.AWS_ASSIGNMENT_TABLE_NAME,
    Item: reminder
  }
  try {
    const response = await docClient.send(new PutCommand(params))
    res.send(response)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}

export const deleteReminder = async (req, res) => {
  const options = {
    headers: {
      Authorization: `Bearer ${req.session.token.access_token}`
    }
  }
  const profile = await coursevilleUtils.getProfileInformation(options)
  const reminder_id = req.params.reminder_id
  const params = {
    TableName: process.env.AWS_ASSIGNMENT_TABLE_NAME,
    Key: {
      user_id: profile.user.id,
      reminder_id: reminder_id
    }
  }
  try {
    const response = await docClient.send(new DeleteCommand(params))
    res.send(response)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
