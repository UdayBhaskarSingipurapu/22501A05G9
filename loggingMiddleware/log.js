const stackList = [ "backend", "frontend" ]
const levelList = [ "info", "warn", "error", "debug", "fatal" ]
const packageList = [ "auth", "config", "middleware", "utils", "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service", "api", "component", "hook", "page", "state", "style" ]

const Log = async (stack, level, pkg, message) => {
    try {
        if(stackList.indexOf(stack) === -1 || levelList.indexOf(level) === -1 || packageList.indexOf(pkg) === -1) {
            throw new Error("Invalid stack, level, or package")
        }
        const result = await fetch('http://20.244.56.144/evaluation-service/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjUwMWEwNWc5QHB2cHNpdC5hYy5pbiIsImV4cCI6MTc1MTA4OTkwMywiaWF0IjoxNzUxMDg5MDAzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMmI1NjkwNjktNjhmOC00Yjg0LWI5ZjctMWU3MTA2NDczNWY1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2luZ2lwdXJhcHUgdWRheSBiaGFza2FyIiwic3ViIjoiNDdjMjJmZDAtZTA3NC00MDhkLTg1NTYtYmE3NmE4ZTZjNWE3In0sImVtYWlsIjoiMjI1MDFhMDVnOUBwdnBzaXQuYWMuaW4iLCJuYW1lIjoic2luZ2lwdXJhcHUgdWRheSBiaGFza2FyIiwicm9sbE5vIjoiMjI1MDFhMDVnOSIsImFjY2Vzc0NvZGUiOiJlSFdOenQiLCJjbGllbnRJRCI6IjQ3YzIyZmQwLWUwNzQtNDA4ZC04NTU2LWJhNzZhOGU2YzVhNyIsImNsaWVudFNlY3JldCI6IlJLckNwYnJ2eWJNZEFBVkMifQ.OfTBk3yu1Up1JINMrmry8kG43DDzVpm6PA9etOJ29qQ'
            },
            body: JSON.stringify({
                stack,
                level,
                'package': pkg,
                message
            })
        })
        const data = await result.json()
        console.log(data)
    }
    catch(error) {
        console.error("Error logging message:", error)
    }
}

export default Log
