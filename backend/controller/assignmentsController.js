import dotenv from 'dotenv'
dotenv.config()
import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import coursevilleUtils from '../utils/coursevilleUtils.js'
import { v4 as uuid } from 'uuid'

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION })

export const getReminders = async (req, res) => {
  console.log('Fetching Reminders')
  const profile = await coursevilleUtils.getProfileInformation(req)
  const params = {
    TableName: process.env.AWS_ASSIGNMENTS_TABLE_NAME,
    FilterExpression: 'user_id = :id',
    ExpressionAttributeValues: {
      ':id': profile.user.id
    }
  }
  try {
    const data = await docClient.send(new ScanCommand(params))
    res.send(data.Items)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}

export const addReminder = async (req, res) => {
  console.log('Adding A Reminder')
  const profile = await coursevilleUtils.getProfileInformation(req)
  const reminder_id = uuid()
  const created_date = Date.now()
  const reminder = {
    id: uuid(),
    user_id: profile.user.id,
    ...req.body,
    created_date: created_date
  }

  const params = {
    TableName: process.env.AWS_ASSIGNMENTS_TABLE_NAME,
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
  console.log('Deleting A Reminder')
  const profile = await coursevilleUtils.getProfileInformation(req)
  const reminder_id = req.params.reminder_id
  const params = {
    TableName: process.env.AWS_ASSIGNMENTS_TABLE_NAME,
    Key: {
      user_id: profile.user.id,
      id: reminder_id
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
