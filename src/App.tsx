import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ClipboardCopy, Download, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { sv } from "date-fns/locale"

type GeneratedFields = {
  identificationNumber: string
  documentInstance: string
  subscriberId: string
  transactionId: string
  messageId: string
  messageCreated: string
  messageSent: string
  messageDate: string
  messageType: string
  messageTypeText: string
  messageText: string
}

type ComplementGeneratedFields = {
  identificationNumber: string
  documentInstance: string
  subscriberId: string
  transactionId: string
  messageComplementId: string
  messageReferenceId: string
  messageComplementRequestId: string
  messageComplementText: string
  messageComplementSent: string
}

type PosGeneratedFields = {
  identificationNumber: string
  subscriberId: string
  transactionId: string
  messageId: string
  messageIdReference: string
  messageCreated: string
  messageSent: string
  messageDate: string
  messageTypeText: string
  messageText: string
}

const DEFAULT_MESSAGE_TEXT = "VARASIDOR TEST REQUEST"
const DEFAULT_MESSAGE_COMPLEMENT_TEXT = "TEST REQUEST-CreateAFMessageComplementDocumentRequest."
const DEFAULT_POS_MESSAGE_TYPE_TEXT = "Arbetssökande med förhinder -14 Den arbetssökande är tillsvidare förhindrad att aktivt söka eller ta ett arbete och uppfyller därför inte de allmänna villkoren."
const DEFAULT_POS_MESSAGE_TEXT = "VARASIDOR TEST REQUEST-CreatePositiveAFMessageDocumentRequest"

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
  const [inputValue, setInputValue] = useState(date ? format(date, "yyyy-MM-dd HH:mm:ss") : "")
  const [open, setOpen] = useState(false)

  function handleSelect(selected: Date | undefined) {
    if (!selected) return
    const d = new Date(selected)
    d.setHours(14, 0, 0, 0)
    onSelect(d)
    setInputValue(format(d, "yyyy-MM-dd HH:mm:ss"))
    setOpen(false)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)
    const parsed = new Date(val)
    if (!isNaN(parsed.getTime())) {
      onSelect(parsed)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="yyyy-MM-dd HH:mm:ss"
          className="font-mono text-sm"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={handleSelect} locale={sv} weekStartsOn={1} showWeekNumber />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

function formatXmlDate(date: Date | undefined): string {
  if (!date) return ""
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "+01:00"
}

function messageIdReferenceListXml(messageIdReference: string): string {
  return messageIdReference
    ? `<int:MessageIdReferenceList>
                  <int:MessageIdReference>${messageIdReference}</int:MessageIdReference>
               </int:MessageIdReferenceList>`
    : `<int:MessageIdReferenceList/>`
}

function staticAfMessageBodyXml(utdragstyp: string): string {
  return `               <int:AFCaseWorker>
                  <int:Firstname>Firstname</int:Firstname>
                  <int:Lastname>Lastname</int:Lastname>
                  <int:TelephoneNumber>TelephoneNumber</int:TelephoneNumber>
                  <int:EmailAddress>EmailAddress</int:EmailAddress>
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
                     <int:EPOST>EPOST</int:EPOST>
                     <int:HEMSIDA>HEMSIDA</int:HEMSIDA>
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
                     <int:ANSOKAN_EPOST>ANSOKAN_EPOST</int:ANSOKAN_EPOST>
                     <int:REFERENSNR>referensnr</int:REFERENSNR>
                     <int:URL_ANNONS_PLATSBANKEN>urlannonsplatsbanken</int:URL_ANNONS_PLATSBANKEN>
                  </int:Plats>
               </int:AFPlatsbanken>
               <int:AFUtdrag>
                  <int:Utdrag>
                     <int:Utdragstyp>${utdragstyp}</int:Utdragstyp>
                     <int:Utdragstext>utdragstext</int:Utdragstext>
                     <int:Utdragsdatum>2020-02-10T00:00:00.000+01:00</int:Utdragsdatum>
                  </int:Utdrag>
               </int:AFUtdrag>`
}

function generateXml(fields: {
  identificationNumber: string
  documentInstance: string
  subscriberId: string
  transactionId: string
  messageId: string
  messageCreated: Date | undefined
  messageSent: Date | undefined
  messageDate: Date | undefined
  messageType: string
  messageTypeText: string
  messageText: string
}): string {
  const {
    identificationNumber,
    documentInstance,
    subscriberId,
    transactionId,
    messageId,
    messageCreated,
    messageSent,
    messageDate,
    messageType,
    messageTypeText,
    messageText,
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
               <int:DocumentInstance>${documentInstance}</int:DocumentInstance>
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
               <int:MessageText>${messageText}</int:MessageText>
${staticAfMessageBodyXml("Aktivitetsrapport")}
            </int:Body>
         </int:AFMessageDocument>
      </int:CreateAFMessageDocumentRequest>
   </soapenv:Body>
</soapenv:Envelope>`
}

function generatePosXml(fields: {
  identificationNumber: string
  subscriberId: string
  transactionId: string
  messageId: string
  messageIdReference: string
  messageCreated: Date | undefined
  messageSent: Date | undefined
  messageDate: Date | undefined
  messageTypeText: string
  messageText: string
}): string {
  const {
    identificationNumber,
    subscriberId,
    transactionId,
    messageId,
    messageIdReference,
    messageCreated,
    messageSent,
    messageDate,
    messageTypeText,
    messageText,
  } = fields

  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://INT013.DocumentService.Schemas">
   <soapenv:Header/>
   <soapenv:Body>
      <int:CreatePositiveAFMessageDocumentRequest>
         <int:AFMessageDocument>
            <int:Header>
               <int:IdentificationNumber>${identificationNumber}</int:IdentificationNumber>
               <int:DocumentType>AFPositiveMessage</int:DocumentType>
               <int:SubsriberId>${subscriberId}</int:SubsriberId>
               <int:DocumentInstance>ORIGINAL</int:DocumentInstance>
            </int:Header>
            <int:Body>
               <int:TransactionId>${transactionId}</int:TransactionId>
               <int:MessageId>${messageId}</int:MessageId>
               ${messageIdReferenceListXml(messageIdReference)}
               <int:MessageCreated>${formatXmlDate(messageCreated)}</int:MessageCreated>
               <int:MessageSent>${formatXmlDate(messageSent)}</int:MessageSent>
               <int:MessageType>ALF9POS</int:MessageType>
               <int:MessageTypeText>${messageTypeText}</int:MessageTypeText>
               <int:MessageDate>${formatXmlDate(messageDate)}</int:MessageDate>
               <int:MessageText>${messageText}</int:MessageText>
${staticAfMessageBodyXml("Handlingsplan")}
            </int:Body>
         </int:AFMessageDocument>
      </int:CreatePositiveAFMessageDocumentRequest>
   </soapenv:Body>
</soapenv:Envelope>`
}

function generateComplementXml(fields: {
  identificationNumber: string
  documentInstance: string
  subscriberId: string
  transactionId: string
  messageComplementId: string
  messageReferenceId: string
  messageComplementRequestId: string
  messageComplementText: string
  messageComplementSent: Date | undefined
}): string {
  const {
    identificationNumber,
    documentInstance,
    subscriberId,
    transactionId,
    messageComplementId,
    messageReferenceId,
    messageComplementRequestId,
    messageComplementText,
    messageComplementSent,
  } = fields

  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://INT013.DocumentService.Schemas">
   <soapenv:Header/>
   <soapenv:Body>
      <int:CreateAFMessageComplementDocumentRequest>
         <int:AFMessageComplementDocument>
            <int:Header>
               <int:IdentificationNumber>${identificationNumber}</int:IdentificationNumber>
               <int:DocumentType>AFMessageComplement</int:DocumentType>
               <int:SubsriberId>${subscriberId}</int:SubsriberId>
               <int:DocumentInstance>${documentInstance}</int:DocumentInstance>
            </int:Header>
            <int:Body>
               <int:TransactionId>${transactionId}</int:TransactionId>
               <int:MessageComplementId>${messageComplementId}</int:MessageComplementId>
               <int:MessageReferenceId>${messageReferenceId}</int:MessageReferenceId>
               <int:MessageComplementRequestId>${messageComplementRequestId}</int:MessageComplementRequestId>
               <int:MessageComplementText>${messageComplementText}</int:MessageComplementText>
               <int:MessageComplementSent>${formatXmlDate(messageComplementSent)}</int:MessageComplementSent>
               <int:AFCaseWorker>
                  <int:Firstname>Firstname</int:Firstname>
                  <int:Lastname>Lastname</int:Lastname>
                  <int:TelephoneNumber>TelephoneNumber</int:TelephoneNumber>
                  <int:EmailAddress>EmailAddress</int:EmailAddress>
               </int:AFCaseWorker>
               <int:AFUtdrag>
                  <int:Utdrag>
                     <int:Utdragstyp>Handlingsplan</int:Utdragstyp>
                     <int:Utdragstext>Utdragstext</int:Utdragstext>
                     <int:Utdragsdatum>2020-02-10T00:00:00.000+01:00</int:Utdragsdatum>
                  </int:Utdrag>
               </int:AFUtdrag>
            </int:Body>
         </int:AFMessageComplementDocument>
      </int:CreateAFMessageComplementDocumentRequest>
   </soapenv:Body>
</soapenv:Envelope>`
}

export default function App() {
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [documentInstance, setDocumentInstance] = useState("ORIGINAL")
  const [subscriberId, setSubscriberId] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [messageId, setMessageId] = useState("")
  const [messageCreated, setMessageCreated] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(14, 0, 0, 0); return d })
  const [messageSent, setMessageSent] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() - 6); d.setHours(14, 0, 0, 0); return d })
  const [messageDate, setMessageDate] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() - 14); d.setHours(14, 0, 0, 0); return d })
  const [messageType, setMessageType] = useState("")
  const [xmlType, setXmlType] = useState<"AFM" | "AFMPOS" | "AFM Komplettering">("AFM")
  const [generatedXml, setGeneratedXml] = useState("")
  const [copied, setCopied] = useState(false)
  const [messageIdCopied, setMessageIdCopied] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [prevGeneratedFields, setPrevGeneratedFields] = useState<GeneratedFields | null>(null)
  const [prevComplementGeneratedFields, setPrevComplementGeneratedFields] = useState<ComplementGeneratedFields | null>(null)
  const [prevPosGeneratedFields, setPrevPosGeneratedFields] = useState<PosGeneratedFields | null>(null)
  const [highlightedValues, setHighlightedValues] = useState<Set<string>>(new Set())

  const [messageTypeText, setMessageTypeText] = useState("")
  const [messageText, setMessageText] = useState(DEFAULT_MESSAGE_TEXT)

  const [complementIdentificationNumber, setComplementIdentificationNumber] = useState("")
  const complementDocumentInstance = "ORIGINAL"
  const [complementSubscriberId, setComplementSubscriberId] = useState("")
  const [complementTransactionId, setComplementTransactionId] = useState("")
  const [complementMessageComplementId, setComplementMessageComplementId] = useState("")
  const [complementMessageReferenceId, setComplementMessageReferenceId] = useState("")
  const [complementMessageComplementRequestId, setComplementMessageComplementRequestId] = useState("")
  const [complementMessageComplementText, setComplementMessageComplementText] = useState(DEFAULT_MESSAGE_COMPLEMENT_TEXT)
  const [complementMessageComplementSent, setComplementMessageComplementSent] = useState<Date | undefined>(() => { const d = new Date(); d.setHours(14, 0, 0, 0); return d })

  const [posIdentificationNumber, setPosIdentificationNumber] = useState("")
  const [posSubscriberId, setPosSubscriberId] = useState("")
  const [posTransactionId, setPosTransactionId] = useState("")
  const [posMessageId, setPosMessageId] = useState("")
  const [posMessageIdReference, setPosMessageIdReference] = useState("")
  const [posMessageCreated, setPosMessageCreated] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() - 7); d.setHours(14, 0, 0, 0); return d })
  const [posMessageSent, setPosMessageSent] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() - 6); d.setHours(14, 0, 0, 0); return d })
  const [posMessageDate, setPosMessageDate] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() - 14); d.setHours(14, 0, 0, 0); return d })
  const [posMessageTypeText, setPosMessageTypeText] = useState(DEFAULT_POS_MESSAGE_TYPE_TEXT)
  const [posMessageText, setPosMessageText] = useState(DEFAULT_POS_MESSAGE_TEXT)

  function handleMessageTypeChange(value: string) {
    setMessageType(value)
    setMessageTypeText(MESSAGE_TYPES.find((m) => m.value === value)?.text ?? "")
  }

  function handleGenerate() {
    const currentFields: GeneratedFields = {
      identificationNumber,
      documentInstance,
      subscriberId,
      transactionId,
      messageId,
      messageCreated: formatXmlDate(messageCreated),
      messageSent: formatXmlDate(messageSent),
      messageDate: formatXmlDate(messageDate),
      messageType,
      messageTypeText,
      messageText,
    }
    const xml = generateXml({
      identificationNumber,
      documentInstance,
      subscriberId,
      transactionId,
      messageId,
      messageCreated,
      messageSent,
      messageDate,
      messageType,
      messageTypeText,
      messageText,
    })
    setGeneratedXml(xml)
    setGenerated(true)
    setTimeout(() => setGenerated(false), 2000)
    if (prevGeneratedFields) {
      const changed = new Set<string>()
      for (const key of Object.keys(currentFields) as (keyof GeneratedFields)[]) {
        if (currentFields[key] !== prevGeneratedFields[key] && currentFields[key] !== '') {
          changed.add(currentFields[key])
        }
      }
      setHighlightedValues(changed)
    } else {
      setHighlightedValues(new Set())
    }
    setPrevGeneratedFields(currentFields)
  }

  function handleGenerateComplement() {
    const currentFields: ComplementGeneratedFields = {
      identificationNumber: complementIdentificationNumber,
      documentInstance: complementDocumentInstance,
      subscriberId: complementSubscriberId,
      transactionId: complementTransactionId,
      messageComplementId: complementMessageComplementId,
      messageReferenceId: complementMessageReferenceId,
      messageComplementRequestId: complementMessageComplementRequestId,
      messageComplementText: complementMessageComplementText,
      messageComplementSent: formatXmlDate(complementMessageComplementSent),
    }
    const xml = generateComplementXml({
      identificationNumber: complementIdentificationNumber,
      documentInstance: complementDocumentInstance,
      subscriberId: complementSubscriberId,
      transactionId: complementTransactionId,
      messageComplementId: complementMessageComplementId,
      messageReferenceId: complementMessageReferenceId,
      messageComplementRequestId: complementMessageComplementRequestId,
      messageComplementText: complementMessageComplementText,
      messageComplementSent: complementMessageComplementSent,
    })
    setGeneratedXml(xml)
    setGenerated(true)
    setTimeout(() => setGenerated(false), 2000)
    if (prevComplementGeneratedFields) {
      const changed = new Set<string>()
      for (const key of Object.keys(currentFields) as (keyof ComplementGeneratedFields)[]) {
        if (currentFields[key] !== prevComplementGeneratedFields[key] && currentFields[key] !== '') {
          changed.add(currentFields[key])
        }
      }
      setHighlightedValues(changed)
    } else {
      setHighlightedValues(new Set())
    }
    setPrevComplementGeneratedFields(currentFields)
  }

  function handleGeneratePos() {
    const currentFields: PosGeneratedFields = {
      identificationNumber: posIdentificationNumber,
      subscriberId: posSubscriberId,
      transactionId: posTransactionId,
      messageId: posMessageId,
      messageIdReference: posMessageIdReference,
      messageCreated: formatXmlDate(posMessageCreated),
      messageSent: formatXmlDate(posMessageSent),
      messageDate: formatXmlDate(posMessageDate),
      messageTypeText: posMessageTypeText,
      messageText: posMessageText,
    }
    const xml = generatePosXml({
      identificationNumber: posIdentificationNumber,
      subscriberId: posSubscriberId,
      transactionId: posTransactionId,
      messageId: posMessageId,
      messageIdReference: posMessageIdReference,
      messageCreated: posMessageCreated,
      messageSent: posMessageSent,
      messageDate: posMessageDate,
      messageTypeText: posMessageTypeText,
      messageText: posMessageText,
    })
    setGeneratedXml(xml)
    setGenerated(true)
    setTimeout(() => setGenerated(false), 2000)
    if (prevPosGeneratedFields) {
      const changed = new Set<string>()
      for (const key of Object.keys(currentFields) as (keyof PosGeneratedFields)[]) {
        if (currentFields[key] !== prevPosGeneratedFields[key] && currentFields[key] !== '') {
          changed.add(currentFields[key])
        }
      }
      setHighlightedValues(changed)
    } else {
      setHighlightedValues(new Set())
    }
    setPrevPosGeneratedFields(currentFields)
  }

  function renderXmlWithHighlights(xml: string, highlights: Set<string>) {
    if (highlights.size === 0) return xml
    const lines = xml.split('\n')
    return lines.map((line, i) => {
      const match = line.match(/^(\s*<[^>\/][^>]*>)([^<]+)(<\/[^>]+>)(\s*)$/)
      if (match) {
        const [, open, value, close, trailing] = match
        if (highlights.has(value)) {
          return (
            <span key={i}>{open}<span className="text-red-500">{value}</span>{close}{trailing}{i < lines.length - 1 ? '\n' : ''}</span>
          )
        }
      }
      return i < lines.length - 1 ? line + '\n' : line
    })
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedXml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCopyMessageId() {
    navigator.clipboard.writeText(messageId)
    setMessageIdCopied(true)
    setTimeout(() => setMessageIdCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([generatedXml], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = xmlType === "AFM"
      ? `${identificationNumber}_${messageType}_${messageId}.txt`
      : xmlType === "AFMPOS"
      ? `${posIdentificationNumber}_AFMPOS_${posMessageId}.txt`
      : `${complementIdentificationNumber}_Komplettering_${complementMessageComplementId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">XML Generator</h1>
        <p className="text-muted-foreground">Fill in the fields below and generate a SOAP message.</p>
        <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted">
          🔒 No personal identity numbers or other data are saved – everything is handled locally in your browser.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
          {/* Left: form */}
          <Card>
            <CardHeader>
              <CardTitle>Editable fields</CardTitle>
              <div className="flex gap-2 pt-1">
                <Button
                  variant={xmlType === "AFM" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setXmlType("AFM")}
                >
                  AFM
                </Button>
                <Button
                  variant={xmlType === "AFMPOS" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setXmlType("AFMPOS")}
                >
                  AFMPOS
                </Button>
                <Button
                  variant={xmlType === "AFM Komplettering" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setXmlType("AFM Komplettering")}
                >
                  AFM Komplettering
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {xmlType === "AFM" && (<>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="identificationNumber">IdentificationNumber</Label>
                  <Input
                    id="identificationNumber"
                    value={identificationNumber}
                    onChange={(e) => setIdentificationNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>DocumentInstance</Label>
                  <Select value={documentInstance} onValueChange={setDocumentInstance}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORIGINAL">ORIGINAL</SelectItem>
                      <SelectItem value="COPY">COPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subscriberId">SubscriberId</Label>
                  <Input
                    id="subscriberId"
                    value={subscriberId}
                    onChange={(e) => setSubscriberId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="transactionId">TransactionId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setTransactionId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="messageId">MessageId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="messageId"
                      value={messageId}
                      onChange={(e) => setMessageId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setMessageId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                    <Button variant="outline" size="icon" className="shrink-0" onClick={handleCopyMessageId}>
                      {messageIdCopied ? <CheckCircle2 className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>MessageType</Label>
                <Select value={messageType} onValueChange={handleMessageTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type..." />
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
                  <Input
                    value={messageTypeText}
                    onChange={(e) => setMessageTypeText(e.target.value)}
                    className="text-sm"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="messageText">MessageText</Label>
                <Input
                  id="messageText"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <DatePicker label="MessageCreated" date={messageCreated} onSelect={setMessageCreated} />
                <DatePicker label="MessageSent" date={messageSent} onSelect={setMessageSent} />
                <DatePicker label="MessageDate" date={messageDate} onSelect={setMessageDate} />
              </div>

              <Button onClick={handleGenerate} className="w-full">
                {generated ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Generated!
                  </>
                ) : (
                  "Generate XML"
                )}
              </Button>
              </>)}
              {xmlType === "AFM Komplettering" && (<>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="complementIdentificationNumber">IdentificationNumber</Label>
                  <Input
                    id="complementIdentificationNumber"
                    value={complementIdentificationNumber}
                    onChange={(e) => setComplementIdentificationNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="complementSubscriberId">SubscriberId</Label>
                  <Input
                    id="complementSubscriberId"
                    value={complementSubscriberId}
                    onChange={(e) => setComplementSubscriberId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="complementTransactionId">TransactionId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="complementTransactionId"
                      value={complementTransactionId}
                      onChange={(e) => setComplementTransactionId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setComplementTransactionId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="complementMessageComplementId">MessageComplementId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="complementMessageComplementId"
                      value={complementMessageComplementId}
                      onChange={(e) => setComplementMessageComplementId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setComplementMessageComplementId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="complementMessageReferenceId">MessageReferenceId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="complementMessageReferenceId"
                      value={complementMessageReferenceId}
                      onChange={(e) => setComplementMessageReferenceId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setComplementMessageReferenceId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="complementMessageComplementRequestId">MessageComplementRequestId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="complementMessageComplementRequestId"
                      value={complementMessageComplementRequestId}
                      onChange={(e) => setComplementMessageComplementRequestId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setComplementMessageComplementRequestId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="complementMessageComplementText">MessageComplementText</Label>
                <Input
                  id="complementMessageComplementText"
                  value={complementMessageComplementText}
                  onChange={(e) => setComplementMessageComplementText(e.target.value)}
                />
              </div>

              <Separator />

              <DatePicker label="MessageComplementSent" date={complementMessageComplementSent} onSelect={setComplementMessageComplementSent} />

              <Button onClick={handleGenerateComplement} className="w-full">
                {generated ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Generated!
                  </>
                ) : (
                  "Generate XML"
                )}
              </Button>
              </>)}
              {xmlType === "AFMPOS" && (<>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="posIdentificationNumber">IdentificationNumber</Label>
                  <Input
                    id="posIdentificationNumber"
                    value={posIdentificationNumber}
                    onChange={(e) => setPosIdentificationNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="posSubscriberId">SubscriberId</Label>
                  <Input
                    id="posSubscriberId"
                    value={posSubscriberId}
                    onChange={(e) => setPosSubscriberId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="posTransactionId">TransactionId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="posTransactionId"
                      value={posTransactionId}
                      onChange={(e) => setPosTransactionId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setPosTransactionId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="posMessageId">MessageId</Label>
                  <div className="flex gap-2">
                    <Input
                      id="posMessageId"
                      value={posMessageId}
                      onChange={(e) => setPosMessageId(e.target.value)}
                    />
                    <Button variant="outline" size="icon" className="shrink-0" onClick={() => setPosMessageId((v) => String((parseInt(v) || 0) + 1))}>+</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="posMessageIdReference">MessageIdReference (optional)</Label>
                  <Input
                    id="posMessageIdReference"
                    value={posMessageIdReference}
                    onChange={(e) => setPosMessageIdReference(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="posMessageTypeText">MessageTypeText</Label>
                <Input
                  id="posMessageTypeText"
                  value={posMessageTypeText}
                  onChange={(e) => setPosMessageTypeText(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="posMessageText">MessageText</Label>
                <Input
                  id="posMessageText"
                  value={posMessageText}
                  onChange={(e) => setPosMessageText(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <DatePicker label="MessageCreated" date={posMessageCreated} onSelect={setPosMessageCreated} />
                <DatePicker label="MessageSent" date={posMessageSent} onSelect={setPosMessageSent} />
                <DatePicker label="MessageDate" date={posMessageDate} onSelect={setPosMessageDate} />
              </div>

              <Button onClick={handleGeneratePos} className="w-full">
                {generated ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Generated!
                  </>
                ) : (
                  "Generate XML"
                )}
              </Button>
              </>)}
            </CardContent>
          </Card>

          {/* Right: XML preview */}
          <Card className="lg:sticky lg:top-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated XML</CardTitle>
              {generatedXml && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <ClipboardCopy className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-md p-4 text-xs overflow-auto max-h-[70vh] whitespace-pre-wrap break-all min-h-24">
                {generatedXml ? renderXmlWithHighlights(generatedXml, highlightedValues) : <span className="text-muted-foreground">XML will appear here when you click "Generate XML".</span>}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
