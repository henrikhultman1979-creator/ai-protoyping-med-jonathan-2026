import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ClipboardCopy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const MESSAGE_TYPES: { label: string; value: string; text: string }[] = [
  { label: "ALF43P1 / 7:2P1",   value: "ALF43P1",  text: "Inte medverkat till att upprätta en handlingsplan." },
  { label: "ALF43P2 / 7:2P2",   value: "ALF43P2",  text: "Inte lämnat in aktivitetsrapport i tid." },
  { label: "ALF43P3A / 7:2P3",  value: "ALF43P3A", text: "Inte besökt/kontaktat AF" },
  { label: "ALF43P3B / 7:2P3",  value: "ALF43P3B", text: "Inte besökt/kontaktat leverantör." },
  { label: "ALF43P4 / 7:2P4",   value: "ALF43P4",  text: "Inte sökt anvisat arbete" },
  { label: "ALF43P5 / 7:2",     value: "ALF43P5",  text: "Inte aktivt sökt lämpliga arbeten" },
  { label: "ALF43AP1 / 7:3P1",  value: "ALF43AP1", text: "Avvisat erbjudet arbete." },
  { label: "ALF43AP2 / 7:3P2",  value: "ALF43AP2", text: "Orsakat att man inte anställts" },
  { label: "ALF43AP3 / 7:3P3",  value: "ALF43AP3", text: "Avvisat erbjudet program" },
  { label: "ALF43BP1 / 7:4P1",  value: "ALF43BP1", text: "Lämnat arbete utan giltig anledning" },
  { label: "ALF43BP2 / 7:4P2",  value: "ALF43BP2", text: "Skiljts från arbetet pga otillbörligt uppförande" },
  { label: "ALF43BP3 / 7:4P3",  value: "ALF43BP3", text: "Lämnat program utan giltig anledning" },
  { label: "ALF43BP4 / 7:4P4",  value: "ALF43BP4", text: "Skiljts från program pga otillbörligt uppförande" },
  { label: "ALF9P1 / 2:1P1",    value: "ALF9P1",   text: "Inte arbetsför och oförhindrad" },
  { label: "ALF9P1A / 2:1P1A",  value: "ALF9P1A",  text: "Inte arbetsför och oförhindrad – tillfälligt sjuk" },
  { label: "ALF9P1B / 2:1P1B",  value: "ALF9P1B",  text: "Inte arbetsför och oförhindrad – tillfälligt förhindrad" },
  { label: "ALF9P2 / 2:1P2",    value: "ALF9P2",   text: "Inte anmäld hos AF" },
  { label: "ALF9P3 / 2:1 P3",   value: "ALF9P3",   text: "Inte till arbetsmarknadens förfogande" },
  { label: "ALF9SKAT / 2:1SKAT",value: "ALF9SKAT", text: "Inte arbetsför och oförhindrad – ny sökandekategori" },
  { label: "ALF9POS / 2:1POS",  value: "ALF9POS",  text: "Bedöms åter uppfylla de allmänna villkore" },
]

function DatePicker({
  label,
  date,
  onSelect,
}: {
  label: string
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}) {
  function handleSelect(selected: Date | undefined) {
    if (!selected) {
      onSelect(undefined)
      return
    }
    const now = new Date()
    selected.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
    onSelect(selected)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "yyyy-MM-dd HH:mm:ss") : "Välj datum"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function formatXmlDate(date: Date | undefined): string {
  if (!date) return ""
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+01:00"
}

function generateXml(fields: {
  identificationNumber: string
  subscriberId: string
  transactionId: string
  messageId: string
  messageCreated: Date | undefined
  messageSent: Date | undefined
  messageDate: Date | undefined
  messageType: string
  messageTypeText: string
}): string {
  const {
    identificationNumber,
    subscriberId,
    transactionId,
    messageId,
    messageCreated,
    messageSent,
    messageDate,
    messageType,
    messageTypeText,
  } = fields

  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://INT013.DocumentService.Schemas">
   <soapenv:Header/>
   <soapenv:Body>
      <int:CreateAFMessageDocumentRequest>
         <int:AFMessageDocument>
            <int:Header>
               <int:IdentificationNumber>${identificationNumber}</int:IdentificationNumber>
               <int:DocumentType>AFMessage</int:DocumentType>
               <int:SubsriberId>${subscriberId}</int:SubsriberId>
               <int:DocumentInstance>ORIGINAL</int:DocumentInstance>
            </int:Header>
            <int:Body>
               <int:TransactionId>${transactionId}</int:TransactionId>
               <int:MessageId>${messageId}</int:MessageId>
               <int:MessageIdReferenceList/>
               <int:MessageCreated>${formatXmlDate(messageCreated)}</int:MessageCreated>
               <int:MessageSent>${formatXmlDate(messageSent)}</int:MessageSent>
               <int:MessageType>${messageType}</int:MessageType>
               <int:MessageTypeText>${messageTypeText}</int:MessageTypeText>
               <int:MessageDate>${formatXmlDate(messageDate)}</int:MessageDate>
               <int:MessageText>VARASIDOR TEST REQUEST</int:MessageText>
               <int:AFCaseWorker>
                  <int:Firstname>Firstname</int:Firstname>
                  <int:Lastname>Lastname</int:Lastname>
                  <int:TelephoneNumber>0735804448</int:TelephoneNumber>
                  <int:EmailAddress>autotest@sverigesakassor.se</int:EmailAddress>
               </int:AFCaseWorker>
               <int:AdditionalParty>
                  <int:AdditionalPartyName>AdditionalPartyName</int:AdditionalPartyName>
               </int:AdditionalParty>
               <int:AFProgram>
                  <int:ProgramType>ProgramType</int:ProgramType>
                  <int:ProgramStart>2020-02-10T00:00:00.000+01:00</int:ProgramStart>
                  <int:ProgramEnd>2020-02-10T00:00:00.000+01:00</int:ProgramEnd>
               </int:AFProgram>
               <int:AFPlatsbanken>
                  <int:Plats>
                     <int:ORDER_ID>1234</int:ORDER_ID>
                     <int:ANVISNINGSDATUM>2020-02-10</int:ANVISNINGSDATUM>
                     <int:SVARSDATUM>2020-02-10</int:SVARSDATUM>
                     <int:KONTAKT_TYP>Post</int:KONTAKT_TYP>
                     <int:PLATSBANKID>1234</int:PLATSBANKID>
                     <int:PLATSRUBRIK>platsrubrik</int:PLATSRUBRIK>
                     <int:SSYK>ssyk</int:SSYK>
                     <int:YRKE_ID>1234</int:YRKE_ID>
                     <int:YRKESBENAMNING>yrkesbenamning</int:YRKESBENAMNING>
                     <int:ERFARENHETSKRAV>true</int:ERFARENHETSKRAV>
                     <int:ARBETSTID>Heltid</int:ARBETSTID>
                     <int:VARAKTIGHET>Tillsvidare</int:VARAKTIGHET>
                     <int:ARBETSGIVARNAMN>arbetsgivarnamn</int:ARBETSGIVARNAMN>
                     <int:TELNR>0123456</int:TELNR>
                     <int:ADRESSLAND>adressland</int:ADRESSLAND>
                     <int:BESOKSADRESS>besoksadress</int:BESOKSADRESS>
                     <int:UTDELNINGSADRESS>utdelningsadress</int:UTDELNINGSADRESS>
                     <int:POSTNR>13131</int:POSTNR>
                     <int:POSTORT>stockholm</int:POSTORT>
                     <int:UTLANDSK_POSTADRESS>utlandsk post address</int:UTLANDSK_POSTADRESS>
                     <int:EPOST>autotest@sverigesakassor.se</int:EPOST>
                     <int:HEMSIDA>sverigesakassor.se</int:HEMSIDA>
                     <int:FAXNR>0123456</int:FAXNR>
                     <int:PLATSBESKRIVNING>platsbeskrivning</int:PLATSBESKRIVNING>
                     <int:BEHORIG_KRAV>behorig krav</int:BEHORIG_KRAV>
                     <int:FORDON_KRAV>fordon krav</int:FORDON_KRAV>
                     <int:ARBETSTIDFORLAGGNING>Dagtid</int:ARBETSTIDFORLAGGNING>
                     <int:KOMMUN>kommun</int:KOMMUN>
                     <int:LONEFORM>Fast lön</int:LONEFORM>
                     <int:KOLLEKTIVAVTAL>true</int:KOLLEKTIVAVTAL>
                     <int:LONEBESKR>lonebeskr</int:LONEBESKR>
                     <int:TILLTRADE>tilltrade</int:TILLTRADE>
                     <int:SISTA_ANSOK_PUBLDATUM>2020-02-10</int:SISTA_ANSOK_PUBLDATUM>
                     <int:SISTA_ANSOKNINGSSDATUM>2020-02-10</int:SISTA_ANSOKNINGSSDATUM>
                     <int:ANSOKAN_OVRIGT>ansokan ovrigt</int:ANSOKAN_OVRIGT>
                     <int:ANSOKAN_EPOST>autotest@sverigesakassor.se</int:ANSOKAN_EPOST>
                     <int:REFERENSNR>referensnr</int:REFERENSNR>
                     <int:URL_ANNONS_PLATSBANKEN>urlannonsplatsbanken</int:URL_ANNONS_PLATSBANKEN>
                  </int:Plats>
               </int:AFPlatsbanken>
               <int:AFUtdrag>
                  <int:Utdrag>
                     <int:Utdragstyp>Aktivitetsrapport</int:Utdragstyp>
                     <int:Utdragstext>utdragstext</int:Utdragstext>
                     <int:Utdragsdatum>2020-02-10T00:00:00.000+01:00</int:Utdragsdatum>
                  </int:Utdrag>
               </int:AFUtdrag>
            </int:Body>
         </int:AFMessageDocument>
      </int:CreateAFMessageDocumentRequest>
   </soapenv:Body>
</soapenv:Envelope>`
}

export default function App() {
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [subscriberId, setSubscriberId] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [messageId, setMessageId] = useState("")
  const [messageCreated, setMessageCreated] = useState<Date | undefined>()
  const [messageSent, setMessageSent] = useState<Date | undefined>()
  const [messageDate, setMessageDate] = useState<Date | undefined>()
  const [messageType, setMessageType] = useState("")
  const [generatedXml, setGeneratedXml] = useState("")
  const [copied, setCopied] = useState(false)

  const messageTypeText = MESSAGE_TYPES.find((m) => m.value === messageType)?.text ?? ""

  function handleGenerate() {
    const xml = generateXml({
      identificationNumber,
      subscriberId,
      transactionId,
      messageId,
      messageCreated,
      messageSent,
      messageDate,
      messageType,
      messageTypeText,
    })
    setGeneratedXml(xml)
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedXml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([generatedXml], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${identificationNumber}_${messageType}_${messageId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">XML-generator – AFMessage</h1>
        <p className="text-muted-foreground">Fyll i fälten nedan och generera ett SOAP-meddelande.</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
          {/* Vänster: formulär */}
          <Card>
            <CardHeader>
              <CardTitle>Redigerbara fält</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="identificationNumber">IdentificationNumber</Label>
                  <Input
                    id="identificationNumber"
                    placeholder="t.ex. 199012193554"
                    value={identificationNumber}
                    onChange={(e) => setIdentificationNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subscriberId">SubscriberId</Label>
                  <Input
                    id="subscriberId"
                    placeholder="t.ex. 58EA2B5B10B44AA5..."
                    value={subscriberId}
                    onChange={(e) => setSubscriberId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="transactionId">TransactionId</Label>
                  <Input
                    id="transactionId"
                    placeholder="t.ex. 991236129"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="messageId">MessageId</Label>
                  <Input
                    id="messageId"
                    placeholder="t.ex. 800001472"
                    value={messageId}
                    onChange={(e) => setMessageId(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>MessageType</Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj meddelandetyp..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MESSAGE_TYPES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {messageTypeText && (
                  <p className="text-sm text-muted-foreground">{messageTypeText}</p>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <DatePicker label="MessageCreated" date={messageCreated} onSelect={setMessageCreated} />
                <DatePicker label="MessageSent" date={messageSent} onSelect={setMessageSent} />
                <DatePicker label="MessageDate" date={messageDate} onSelect={setMessageDate} />
              </div>

              <Button onClick={handleGenerate} className="w-full">
                Generera XML
              </Button>
            </CardContent>
          </Card>

          {/* Höger: XML-förhandsvisning */}
          <Card className="sticky top-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Genererad XML</CardTitle>
              {generatedXml && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <ClipboardCopy className="h-4 w-4 mr-1" />
                    {copied ? "Kopierat!" : "Kopiera"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Spara
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generatedXml ? (
                <pre className="bg-muted rounded-md p-4 text-xs overflow-auto max-h-[70vh] whitespace-pre-wrap break-all">
                  {generatedXml}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm">XML visas här när du klickar på "Generera XML".</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
