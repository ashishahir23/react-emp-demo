import { Typography } from "@mui/material";

const Title = ({ text, isEdit = false }) => {
  return (
    <Typography variant="h6">
       {isEdit ? `Edit ${text}` : `Add ${text}`}
    </Typography>
  )
}

export default Title