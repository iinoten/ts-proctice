const modes = ['normal', 'hard'] as const 
type Mode = typeof modes[number]

class GameProcedure {
    private currentGameTitle = 'hit and blow'
    private currentGame = new HitAndBlow()

    public async start() {
        await this.play()
    }

    public async play() {
        printLine(`===\n${this.currentGameTitle}を開始します。\n===`)
        await this.currentGame.setting()
        await this.currentGame.play()
        this.currentGame.end()
        this.end()
    }

    private end() {
        printLine('ゲームを終了しました。')
        process.exit()
    }
}

class HitAndBlow {
    private readonly answerSource = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    private answer: string[] = [] // 空配列のみだと中身に対しての型推論が働かないので型アノテーションが必要
    private tryCount = 0
    private mode: Mode = 'normal'

    async setting() {
        this.mode = await promptSelect<Mode>('モードを入力してください。', modes) as Mode
        const answerLength = this.getAnswerLength()
        while (this.answer.length < answerLength) {
            const randNum = Math.floor(Math.random() * this.answerSource.length)
            const selectedItem = this.answerSource[randNum]
            if(!this.answer.includes(selectedItem)) {
                this.answer.push(selectedItem)
            }
        }
    }

    private getAnswerLength() {
        switch (this.mode) {
            case 'normal':
                return 3
            case 'hard':
                return 4
            default:
                throw new Error(`${this.mode} は無効なモードです。`)
        }
    }

    private validate(inputArr: string[]) {
        const isLengthValid = inputArr.length === this.answer.length
        const isAllAnswerSourceOption = inputArr.every((val) => this.answerSource.includes(val))
        const isAllDifferentValues = inputArr.every((val,i) => inputArr.indexOf(val) === i)
        return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues
    }

    async play() {
        const inputArr = (await promptInput(`「,」区切りで${this.getAnswerLength()}つの数字を入力してください`)).split(',')
        const result = this.check(inputArr)
        if (!this.validate(inputArr)) {
            printLine('無効な入力です。')
            await this.play()
            return
        }

        if (result.hit !== this.answer.length) {
            //不正解だったら続ける
            printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
            this.tryCount += 1
            await this.play()
        } else {
            // 正解だったら終了
            this.tryCount += 1
        }
    }

    private check(input: string[]) {
        let hitCount = 0
        let blowCount = 0

        input.forEach((val, index) => {
            if (val === this.answer[index]) {
                hitCount += 1
            } else if (this.answer.includes(val)) {
                blowCount += 1
            }
        })

        return {
            hit: hitCount,
            blow: blowCount,
        }
    }

    end() {
        printLine(`正解です！ \n試行回数: ${this.tryCount}回`)
        process.exit()
    }
}

const printLine = (text: string, breakLine: boolean = true) => {
    process.stdout.write(text + (breakLine ? '\n' : ''))
}

const readLine = async () => {
    const input: string = await new Promise((resolve) => process.stdin.once('data', (data)=> resolve(data.toString())))
    return input.trim()
}

const promptSelect = async <T extends string>(text: string, values: readonly string[]): Promise<T> => {
    printLine(`\n${text}`)
    values.forEach((value) => {
        printLine(`- ${value}`)
    })
    printLine('> ', false)

    const input = await readLine() as T
    if (values.includes(input)) {
        return input
    } else {
        return promptSelect<T>(text, values)
    }
}

const promptInput = async (text: string) => {
    printLine(`\n${text}`, false)
    return readLine()
}

;(async () => {
    new GameProcedure().start()
})()



