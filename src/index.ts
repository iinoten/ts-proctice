class HitAndBlow {
    answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    answer: string[] = [] // 空配列のみだと中身に対しての型推論が働かないので型アノテーションが必要
    tryCount = 0
}

const printLine = (text: string, breakLine: boolean = true) => {
    process.stdout.write(text + (breakLine ? '/n' : ''))
}

const promptInput = async (text: string) => {
    printLine(`\n${text}`, false)
    const input: string = await new Promise((resolve) => process.stdin.once(
        'data', (data) => resolve(data.toString())
    ))
    return input.trim()
}

;(async () => {
    const name = await promptInput('名前を入力してください')
    console.log(name)
    const age = await promptInput('年齢を入力してください')
    console.log(age)
    process.exit()
    const hitAndBlow = new HitAndBlow()
})()


