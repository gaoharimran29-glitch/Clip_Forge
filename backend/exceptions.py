class NodeExecutionError(Exception):
    def __init__(self, node: str, message: str):
        self.node = node
        self.message = message
        super().__init__(message)