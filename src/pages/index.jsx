const appName = process.env.NEXT_PUBLIC_APPNAME

export default function Home () {
  return (
    <div>
      {appName}
    </div>
  )
}
