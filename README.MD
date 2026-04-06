## Project Setup

In order to run the project, setup .env and set MONGO_URI variable equal to DB connection string.

In order to avoid port collisions, in the source code port value is 5000

### MongoDB Atlas template

Create file `.env` in `03-task-manager/final` and use this template:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/task-manager?retryWrites=true&w=majority
```

Notes:
- Replace `<username>`, `<password>`, and `<cluster-name>` with your Atlas values.
- If password has special characters, URL-encode it first.
- In Atlas, remember to allow your IP in Network Access and create a DB user.
