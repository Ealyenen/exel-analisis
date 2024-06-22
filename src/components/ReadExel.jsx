import React, { useState } from "react"
import { read } from "xlsx";
import { getStat } from "./getStatistics";
import {
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    List,
    ListItem,
} from "@mui/material";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const ReadExel = () => {
    const [file, setFile] = useState(null)
    const [recommendation, setRecommendation] = useState(null)
    const [towerColors, setTowerColors] = useState(null)

    const getStatistics = (rows) => {
        setRecommendation(getStat(rows))
    }

    const depricatedKeys = (key) => {
        if (key?.length < 2 || (key?.length === 2 && ["0", "1"].includes(key.slice(1)))) {
            return true
        }
        return false
    }

    const readTowersSheet = (sheet) => {
        let rows = []
        for (var key in sheet) {
            if (sheet[key]?.v && !depricatedKeys(key)) {
                const index = Number(key.substring(1))
                const row = rows[index - 2]
                if (!row) {
                    rows.push([sheet[key].v])
                } else {
                    rows[index - 2].push(sheet[key].v)
                }
            }
        }
        getStatistics(rows)
    }

    const readColorSheet = (sheet) => {
        let colors = {}
        for (var key in sheet) {
            if (sheet[key]?.v && !depricatedKeys(key)) {
                if (key.slice(0, 1) === "A") {
                    colors[sheet[key]?.v] = ""
                } else if (key.slice(0, 1) === "B") {
                    colors[sheet["A" + key.substring(1)].v] = sheet[key]?.v
                }
            }
        }
        setTowerColors(colors)
    }

    const readExel = async () => {
        setRecommendation(null)
        if (file) {
            const data = await file.arrayBuffer()
            const workbook = read(data)
            if (workbook?.Sheets?.towers) {
                readTowersSheet(workbook.Sheets?.towers)
            }
            if (workbook?.Sheets?.color) {
                readColorSheet(workbook.Sheets?.color)
            }
        }
    }

    const handleUpload = (e) => {
        const fileRead = e?.target?.files[0]
        if (fileRead) {
            setFile(null)
            setRecommendation(null)
            setFile(fileRead)
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", gap: 2 }}>
                {file &&
                    <Box>
                        <Button variant="contained" color="secondary" onClick={() => readExel()}>
                            {recommendation && "Re"}Count
                        </Button>
                    </Box>
                }
                <label htmlFor="btn-load">
                    <input
                        // accept=""
                        id="btn-load"
                        // multiple
                        type="file"
                        onChange={handleUpload}
                        style={{ display: "none" }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => document.getElementById('btn-load').click()}
                    >
                        choose {file && "another"}
                    </Button>
                </label>
            </Box>
            {recommendation ?
                <Box sx={{ mt: 4, display: "flex", gap: 8 }}>
                    <Box sx={{ width: 600 }}>
                        <Typography variant="h5">
                            Top list
                        </Typography>
                        <TableContainer component={Paper} sx={{ p: 2, mt: 2 }}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><Typography variant="h6">Tower</Typography></TableCell>
                                        <TableCell><Typography variant="h6">Total price</Typography></TableCell>
                                        <TableCell><Typography variant="h6">Waves defeated</Typography></TableCell>
                                        <TableCell><Typography variant="h6">Score</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recommendation?.topArr?.map((row, index) => (
                                        <TableRow
                                            key={`top-list-table${index}`}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell
                                                sx={{
                                                    color: towerColors && towerColors[row[0]],
                                                    fontWeight: 600,
                                                }}>
                                                {row[0]}
                                            </TableCell>
                                            <TableCell align="center">{row[1]}</TableCell>
                                            <TableCell align="center">{row[2]}</TableCell>
                                            <TableCell align="center">{row[3]}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box>
                        <Typography variant="h5">
                            Results
                        </Typography>
                        <List>
                            {recommendation.recList?.map((item, index) => {
                                return (
                                    <ListItem
                                        key={`rec-list-${index}`}
                                        sx={{
                                            borderBottom: item?.divider && "1px dashed",
                                            pb: item?.divider && 4,
                                            mb: item?.divider && 2,
                                        }}
                                    >
                                        <Box sx={{
                                            mr: 2,
                                            width: 30,
                                            height: 30,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "100%",
                                            border: "1px solid",
                                            color: towerColors && towerColors[item.data.split(',')[0]],
                                        }}
                                        >
                                            <ArrowForwardIosRoundedIcon />
                                        </Box>
                                        <Typography sx={{ display: "inline", fontWeight: 600 }}>
                                            {item.data}
                                        </Typography>
                                        <Typography sx={{ display: "inline" }}>
                                            {"\u00A0"}({item.tip})
                                        </Typography>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Box>
                :
                file &&
                <Typography sx={{ mt: 2 }}>
                    Reccomendations haven't been counted
                </Typography>
            }
        </>
    )
}

export default ReadExel