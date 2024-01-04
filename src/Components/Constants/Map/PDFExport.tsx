import styled from "styled-components"
import Button from "../Button"
import { PropsWithChildren } from "react"
import exportIcon from '../../../assets/img/pdfWebView.png'
import logoIcon from '../../../assets/img/logo.png'
import logoTextImg from '../../../assets/img/logoText.png'
import { Document, Page, PDFDownloadLink, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { convertFullTimeStringToHumanTimeFormatByDate } from "../../../Functions/GlobalFunctions"

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'rgba(0,0,0,.2)'
    },
    header: {
        margin: 10,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 4,
        borderBottom: '1px solid black'
    },
    logoContainer: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 3
    },
    logoImg: {
        height: '100%',
    },
    timeContainer: {
        height: '100%',
        justifyContent: 'flex-end'
    },
    body: {
        flex: 1,
        margin: 10,
        marginTop: 0,
        backgroundColor:'red'
    }
})

const PageLayout = ({ children, time }: PropsWithChildren & {
    time: string
}) => {
    return <Page style={styles.page} size="A4">
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image src={logoIcon} style={[styles.logoImg, {
                    width: 16
                }]} />
                <Image src={logoTextImg} style={[styles.logoImg, {
                    height: '70%',
                    width: 72
                }]} />
            </View>
            <View style={styles.timeContainer}>
                <Text style={{
                    color: 'black',
                    fontSize: 10,
                }}>
                    {time}
                </Text>
            </View>
        </View>
        <View style={styles.body}>
            {children}
        </View>
    </Page>
}

const PDFDocument = () => {
    let time = convertFullTimeStringToHumanTimeFormatByDate(new Date())
    return <Document>
        <PageLayout time={time}>

        </PageLayout>
    </Document>
}


type PDFExportProps = PropsWithChildren & {

}

const PDFExport = ({ children }: PDFExportProps) => {
    return <PDFDownloadLink document={<PDFDocument />} fileName="test.pdf">
        {({ blob, url, loading, error }) => <>
            <ExportBtn hover>
                <img src={exportIcon} style={{
                    width: '100%',
                    height: '100%'
                }} />
            </ExportBtn>
        </>}
    </PDFDownloadLink>
}

export default PDFExport

const ExportBtn = styled(Button)`
    position: absolute;
    width: 42px;
    height: 42px;
    border: none;
    padding: 8px;
    left: 16px;
    bottom: 68px;
    z-index: 1;
`